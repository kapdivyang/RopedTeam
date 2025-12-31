// ========================================
// FIREBASE INTEGRATION FOR THE ROPED TEAM
// ========================================

class FirebaseIntegration {
    constructor() {
        this.auth = window.firebaseAuth;
        this.db = window.firebaseDB;
        this.currentUser = null;
        this.currentTeam = null;
        this.unsubscribers = [];

        this.init();
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    async init() {
        // Check authentication state
        this.auth.onAuthStateChanged(async (user) => {
            if (user) {
                this.currentUser = user;
                await this.loadUserData();

                // If user doesn't have a team, try to find one by their email
                if (!this.currentTeamId) {
                    await this.checkUserTeamAssignment();
                }

                if (this.currentTeamId) {
                    await this.loadTeamData();
                    this.setupRealtimeListeners();
                }
                console.log('✅ User authenticated:', user.email);
            } else {
                // Not logged in, redirect to login page
                if (!window.location.pathname.includes('login.html')) {
                    window.location.href = 'login.html';
                }
            }
        });
    }

    // ========================================
    // USER DATA MANAGEMENT
    // ========================================
    async loadUserData() {
        try {
            const userDoc = await this.db.collection('users').doc(this.currentUser.uid).get();

            if (userDoc.exists) {
                const userData = userDoc.data();
                this.currentTeamId = userData.teamId;
                return userData;
            } else {
                // Create user document if it doesn't exist
                await this.db.collection('users').doc(this.currentUser.uid).set({
                    email: this.currentUser.email,
                    displayName: this.currentUser.displayName || this.currentUser.email.split('@')[0],
                    teamId: null,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    // ========================================
    // TEAM DATA MANAGEMENT
    // ========================================
    async loadTeamData() {
        if (!this.currentTeamId) {
            console.log('ℹ️ User not assigned to a team yet');
            return null;
        }

        try {
            const teamDoc = await this.db.collection('teams').doc(this.currentTeamId).get();

            if (teamDoc.exists) {
                this.currentTeam = { id: teamDoc.id, ...teamDoc.data() };
                return this.currentTeam;
            }
        } catch (error) {
            console.error('Error loading team data:', error);
        }
    }

    // ========================================
    // REAL-TIME LISTENERS
    // ========================================
    setupRealtimeListeners() {
        if (!this.currentTeamId) return;

        // Listen to team changes
        const teamUnsubscribe = this.db.collection('teams')
            .doc(this.currentTeamId)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    this.currentTeam = { id: doc.id, ...doc.data() };
                    this.syncTeamToApp();
                }
            });

        // Listen to check-ins for this team
        const checkinsUnsubscribe = this.db.collection('checkins')
            .where('teamId', '==', this.currentTeamId)
            .onSnapshot((snapshot) => {
                this.syncCheckinsToApp(snapshot);
            });

        this.unsubscribers.push(teamUnsubscribe, checkinsUnsubscribe);
    }

    // ========================================
    // SYNC FIREBASE DATA TO APP
    // ========================================
    syncTeamToApp() {
        if (!this.currentTeam || !window.ropedTeamApp) return;

        const app = window.ropedTeamApp;

        // Update team settings
        app.state.groupName = this.currentTeam.name;
        app.state.summitPrize = this.currentTeam.summitPrize;
        app.state.goalDays = this.currentTeam.goalDays;
        app.state.startDate = this.currentTeam.startDate;

        // Update members
        if (this.currentTeam.members) {
            app.state.members = this.currentTeam.members;
        }

        // Re-render UI
        app.renderUI();
    }

    syncCheckinsToApp(snapshot) {
        if (!window.ropedTeamApp) return;

        const app = window.ropedTeamApp;
        app.state.checkins = {};

        snapshot.forEach((doc) => {
            const checkin = doc.data();
            const day = checkin.day;
            const userId = checkin.userId;

            if (!app.state.checkins[day]) {
                app.state.checkins[day] = {};
            }

            // Find member ID by matching user ID
            const member = app.state.members.find(m => m.userId === userId);
            if (member) {
                app.state.checkins[day][member.id] = true;
            }
        });

        // Calculate current day
        app.calculateCurrentDay();

        // Re-render UI
        app.renderUI();
    }

    // ========================================
    // CHECK-IN OPERATIONS
    // ========================================
    async createCheckin(memberId) {
        if (!this.currentTeamId || !this.currentUser) {
            throw new Error('User not authenticated or not in a team');
        }

        const app = window.ropedTeamApp;
        const member = app.state.members.find(m => m.id === memberId);

        if (!member) {
            throw new Error('Member not found');
        }

        // Verify user can only check in for themselves
        if (member.userId !== this.currentUser.uid) {
            throw new Error('You can only check in for yourself');
        }

        const currentDay = app.state.currentDay;

        try {
            // Create check-in document
            await this.db.collection('checkins').add({
                teamId: this.currentTeamId,
                userId: this.currentUser.uid,
                memberId: memberId,
                day: currentDay,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Check-in created successfully');
            return true;
        } catch (error) {
            console.error('Error creating check-in:', error);
            throw error;
        }
    }

    // ========================================
    // TEAM MANAGEMENT (ADMIN ONLY)
    // ========================================
    async createTeam(teamData) {
        if (!this.currentUser) {
            throw new Error('User not authenticated');
        }

        try {
            const teamRef = await this.db.collection('teams').add({
                name: teamData.name,
                adminId: this.currentUser.uid,
                memberIds: [this.currentUser.uid],
                members: teamData.members.map((m, index) => ({
                    id: index + 1,
                    name: m.name,
                    habit: m.habit,
                    emoji: m.emoji || '🧗',
                    email: m.email,
                    userId: null // Will be set when user signs up
                })),
                goalDays: teamData.goalDays || 90,
                summitPrize: teamData.summitPrize,
                startDate: new Date().toISOString().split('T')[0],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Update user's teamId
            await this.db.collection('users').doc(this.currentUser.uid).update({
                teamId: teamRef.id
            });

            this.currentTeamId = teamRef.id;
            await this.loadTeamData();

            console.log('✅ Team created successfully');
            return teamRef.id;
        } catch (error) {
            console.error('Error creating team:', error);
            throw error;
        }
    }

    async updateTeamSettings(updates) {
        if (!this.currentTeamId) {
            throw new Error('No team selected');
        }

        // Verify user is admin
        if (this.currentTeam.adminId !== this.currentUser.uid) {
            throw new Error('Only admin can update team settings');
        }

        try {
            await this.db.collection('teams').doc(this.currentTeamId).update(updates);
            console.log('✅ Team settings updated');
        } catch (error) {
            console.error('Error updating team:', error);
            throw error;
        }
    }

    async assignUserToTeam(userEmail) {
        if (!this.currentTeamId) return;

        try {
            // Find user by email
            const usersSnapshot = await this.db.collection('users')
                .where('email', '==', userEmail)
                .get();

            if (usersSnapshot.empty) {
                console.log('User not found, will be assigned when they sign up');
                return;
            }

            const userDoc = usersSnapshot.docs[0];
            const userId = userDoc.id;

            // Update user's teamId
            await this.db.collection('users').doc(userId).update({
                teamId: this.currentTeamId
            });

            // Update member's userId in team
            const member = this.currentTeam.members.find(m => m.email === userEmail);
            if (member) {
                member.userId = userId;
                await this.updateTeamSettings({ members: this.currentTeam.members });
            }

            console.log('✅ User assigned to team');
        } catch (error) {
            console.error('Error assigning user to team:', error);
        }
    }

    // ========================================
    // AUTHENTICATION HELPERS
    // ========================================
    async logout() {
        try {
            // Unsubscribe from all listeners
            this.unsubscribers.forEach(unsubscribe => unsubscribe());
            this.unsubscribers = [];

            await this.auth.signOut();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    isAdmin() {
        return this.currentTeam && this.currentTeam.adminId === this.currentUser.uid;
    }

    getCurrentMember() {
        if (!this.currentTeam || !this.currentUser) return null;

        return this.currentTeam.members.find(m => m.userId === this.currentUser.uid);
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    async checkUserTeamAssignment() {
        if (!this.currentUser || this.currentTeamId) return;

        try {
            // Find any team where this user's email is in the members list
            // We fetch all teams (there usually aren't many) and check manually 
            // because Firestore array-contains is tricky with objects
            const teamsSnapshot = await this.db.collection('teams').get();

            let foundTeamId = null;
            let foundMemberIndex = -1;

            teamsSnapshot.forEach(doc => {
                const teamData = doc.data();
                const members = teamData.members || [];
                const index = members.findIndex(m => m.email.toLowerCase() === this.currentUser.email.toLowerCase());

                if (index !== -1) {
                    foundTeamId = doc.id;
                    foundMemberIndex = index;
                }
            });

            if (foundTeamId) {
                console.log('✨ Found a team for this user!', foundTeamId);

                // 1. Update user document with teamId
                await this.db.collection('users').doc(this.currentUser.uid).update({
                    teamId: foundTeamId
                });

                // 2. Update the specific member entry in the team to link the userId
                const teamRef = this.db.collection('teams').doc(foundTeamId);
                const teamDoc = await teamRef.get();
                const members = teamDoc.data().members;
                members[foundMemberIndex].userId = this.currentUser.uid;

                await teamRef.update({
                    members: members,
                    memberIds: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid)
                });

                this.currentTeamId = foundTeamId;
                await this.loadTeamData();
                this.setupRealtimeListeners();
            }
        } catch (error) {
            console.error('Error in team assignment:', error);
        }
    }
}

// Initialize Firebase Integration
window.firebaseIntegration = new FirebaseIntegration();

console.log('🔥 Firebase Integration loaded');
