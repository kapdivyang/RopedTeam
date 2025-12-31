// ========================================
// DATA MODELS & STATE MANAGEMENT
// ========================================

class HabitTrackerApp {
    constructor() {
        this.state = {
            groupName: 'K2 Conquerors',
            summitPrize: 'Team Celebration Dinner',
            goalDays: 90,
            currentDay: 1,
            startDate: new Date().toISOString().split('T')[0],
            members: [
                { id: 1, name: 'Alex', habit: 'Morning Exercise', emoji: '🧗‍♂️' },
                { id: 2, name: 'Sarah', habit: 'Meditation', emoji: '🧗‍♀️' },
                { id: 3, name: 'Mike', habit: 'Reading', emoji: '🧗' },
                { id: 4, name: 'Emma', habit: 'Journaling', emoji: '🧗‍♀️' },
                { id: 5, name: 'David', habit: 'No Social Media', emoji: '🧗‍♂️' },
                { id: 6, name: 'Lisa', habit: 'Healthy Eating', emoji: '🧗‍♀️' },
                { id: 7, name: 'Tom', habit: 'Early Wake Up', emoji: '🧗‍♂️' },
                { id: 8, name: 'Nina', habit: 'Coding Practice', emoji: '🧗‍♀️' }
            ],
            checkins: {}, // { day: { memberId: true/false } }
            checkinDetails: {}, // { day: [{ memberId, memberName, timestamp }] } - for first anchor tracking
            baseCamps: [], // Array of week numbers that achieved perfect completion
            weeklyProgress: {} // { week: { memberId: [days completed] } }
        };

        this.loadState();
        this.init();
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.calculateCurrentDay();
        this.renderUI();
        this.setupDailyReset();
    }

    cacheElements() {
        // Header
        this.summitPrizeEl = document.getElementById('summitPrize');

        // Progress Overview
        this.currentDayEl = document.getElementById('currentDay');
        this.altitudeValueEl = document.getElementById('altitudeValue');
        this.altitudeProgressEl = document.getElementById('altitudeProgress');
        this.teamMarkerEl = document.getElementById('teamMarker');
        this.baseCampsCountEl = document.getElementById('baseCampsCount');
        this.teamStreakEl = document.getElementById('teamStreak');
        this.todayCheckinsEl = document.getElementById('todayCheckins');

        // Roped Team
        this.ropeContainerEl = document.getElementById('ropeContainer');

        // Milestones
        this.milestonesGridEl = document.getElementById('milestonesGrid');

        // Check-in
        this.userSelectEl = document.getElementById('userSelect');
        this.checkinBtnEl = document.getElementById('checkinBtn');
        this.checkinStatusEl = document.getElementById('checkinStatus');

        // Personal Progress
        this.personalProgressSectionEl = document.getElementById('personalProgressSection');
        this.personalProgressNameEl = document.getElementById('personalProgressName');
        this.personalTotalCheckinsEl = document.getElementById('personalTotalCheckins');
        this.personalCurrentStreakEl = document.getElementById('personalCurrentStreak');
        this.personalBestStreakEl = document.getElementById('personalBestStreak');
        this.personalCompletionRateEl = document.getElementById('personalCompletionRate');
        this.personalCalendarEl = document.getElementById('personalCalendar');

        // Admin
        this.adminToggleEl = document.getElementById('adminToggle');
        this.adminContentEl = document.getElementById('adminContent');
        this.groupNameEl = document.getElementById('groupName');
        this.prizeNameEl = document.getElementById('prizeName');
        this.membersListEl = document.getElementById('membersList');
        this.saveSettingsEl = document.getElementById('saveSettings');
        this.resetProgressEl = document.getElementById('resetProgress');

        // Modal
        this.celebrationModalEl = document.getElementById('celebrationModal');
        this.celebrationTitleEl = document.getElementById('celebrationTitle');
        this.celebrationMessageEl = document.getElementById('celebrationMessage');
        this.closeCelebrationEl = document.getElementById('closeCelebration');

        // Team Progress Overview
        this.teamProgressGridEl = document.getElementById('teamProgressGrid');

        // User Info & Logout
        this.userInfoEl = document.getElementById('userInfo');
        this.userNameEl = document.getElementById('userName');
        this.logoutBtnEl = document.getElementById('logoutBtn');

        // Link Member Tool
        this.linkMemberEmailEl = document.getElementById('linkMemberEmail');
        this.linkMemberBtnEl = document.getElementById('linkMemberBtn');
        this.linkStatusEl = document.getElementById('linkStatus');

        // Personalized Check-in
        this.personalizedCheckinEl = document.getElementById('personalizedCheckin');
        this.adminCheckinEl = document.getElementById('adminCheckin');
        this.memberGreetingEl = document.getElementById('memberGreeting');
        this.memberHabitEl = document.getElementById('memberHabit');
        this.quickCheckinBtnEl = document.getElementById('quickCheckinBtn');
        this.quickCheckinStatusEl = document.getElementById('quickCheckinStatus');

        // First Anchor Elements
        this.firstAnchorBadgeEl = document.getElementById('firstAnchorBadge');
        this.firstAnchorsListEl = document.getElementById('firstAnchorsList');
    }

    attachEventListeners() {
        // User selection
        this.userSelectEl.addEventListener('change', () => this.handleUserSelection());

        // Check-in button
        this.checkinBtnEl.addEventListener('click', () => this.handleCheckin());

        // Admin panel
        this.adminToggleEl.addEventListener('click', () => this.toggleAdminPanel());
        this.saveSettingsEl.addEventListener('click', () => this.saveSettings());
        this.resetProgressEl.addEventListener('click', () => this.resetProgress());

        // Modal
        this.closeCelebrationEl.addEventListener('click', () => this.closeModal());

        // Logout
        if (this.logoutBtnEl) {
            this.logoutBtnEl.addEventListener('click', () => this.handleLogout());
        }

        // Link Member Tool
        if (this.linkMemberBtnEl) {
            this.linkMemberBtnEl.addEventListener('click', () => this.handleLinkMember());
        }

        // Quick Check-in
        if (this.quickCheckinBtnEl) {
            this.quickCheckinBtnEl.addEventListener('click', () => this.handleQuickCheckin());
        }
    }

    handleLogout() {
        if (window.firebaseIntegration) {
            window.firebaseIntegration.logout();
        }
    }

    showUserInfo(user) {
        if (this.userInfoEl && this.userNameEl) {
            this.userNameEl.textContent = user.displayName || user.email;
            this.userInfoEl.style.display = 'flex';
        }
    }

    async handleLinkMember() {
        const email = this.linkMemberEmailEl.value.trim().toLowerCase();

        if (!email) {
            this.linkStatusEl.textContent = '❌ Please enter an email address';
            this.linkStatusEl.style.color = '#FCA5A5';
            return;
        }

        if (!window.firebaseIntegration || !window.firebaseIntegration.currentTeamId) {
            this.linkStatusEl.textContent = '❌ No team found. Please save settings first.';
            this.linkStatusEl.style.color = '#FCA5A5';
            return;
        }

        try {
            this.linkMemberBtnEl.disabled = true;
            this.linkMemberBtnEl.textContent = '⏳ Linking...';
            this.linkStatusEl.textContent = 'Searching for user...';
            this.linkStatusEl.style.color = '#B8E6F5';

            // Find user by email
            const usersSnapshot = await firebaseDB.collection('users')
                .where('email', '==', email)
                .get();

            if (usersSnapshot.empty) {
                this.linkStatusEl.textContent = '❌ No user found with that email. Ask them to create an account first.';
                this.linkStatusEl.style.color = '#FCA5A5';
                this.linkMemberBtnEl.disabled = false;
                this.linkMemberBtnEl.textContent = 'Link Member';
                return;
            }

            const userDoc = usersSnapshot.docs[0];
            const userId = userDoc.id;
            const teamId = window.firebaseIntegration.currentTeamId;

            // Update user's teamId
            await firebaseDB.collection('users').doc(userId).update({
                teamId: teamId
            });

            // Update team's members array to link userId
            const teamDoc = await firebaseDB.collection('teams').doc(teamId).get();
            const members = teamDoc.data().members;
            const memberIndex = members.findIndex(m => m.email && m.email.toLowerCase() === email);

            if (memberIndex !== -1) {
                members[memberIndex].userId = userId;
                await firebaseDB.collection('teams').doc(teamId).update({
                    members: members,
                    memberIds: firebase.firestore.FieldValue.arrayUnion(userId)
                });
            }

            this.linkStatusEl.textContent = '✅ Member linked! Ask them to refresh their page.';
            this.linkStatusEl.style.color = '#10B981';
            this.linkMemberEmailEl.value = '';

            setTimeout(() => {
                this.linkStatusEl.textContent = '';
            }, 5000);

        } catch (error) {
            console.error('Link member error:', error);
            this.linkStatusEl.textContent = '❌ Error: ' + error.message;
            this.linkStatusEl.style.color = '#FCA5A5';
        } finally {
            this.linkMemberBtnEl.disabled = false;
            this.linkMemberBtnEl.textContent = 'Link Member';
        }
    }

    setupCheckinInterface() {
        // Check if user is admin or regular member
        const isAdmin = window.firebaseIntegration && window.firebaseIntegration.isAdmin();
        const currentMember = window.firebaseIntegration && window.firebaseIntegration.getCurrentMember();

        if (isAdmin) {
            // Show admin dropdown interface
            this.personalizedCheckinEl.style.display = 'none';
            this.adminCheckinEl.style.display = 'block';
            // Keep admin button visible
            if (this.adminToggleEl) {
                this.adminToggleEl.style.display = 'block';
            }
        } else if (currentMember) {
            // Show personalized interface for regular members
            this.personalizedCheckinEl.style.display = 'block';
            this.adminCheckinEl.style.display = 'none';

            // Hide admin button
            if (this.adminToggleEl) {
                this.adminToggleEl.style.display = 'none';
            }

            // Set personalized text
            this.memberGreetingEl.textContent = `Good day, ${currentMember.name}! 🏔️`;
            this.memberHabitEl.textContent = currentMember.habit;

            // Check if already checked in today
            const alreadyCheckedIn = this.isMemberCheckedInToday(currentMember.id);

            if (alreadyCheckedIn) {
                this.quickCheckinBtnEl.disabled = true;
                this.quickCheckinBtnEl.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">Already done today!</span>';
                this.quickCheckinStatusEl.textContent = '🎉 Great job! See you tomorrow!';
                this.quickCheckinStatusEl.className = 'checkin-status success';
            } else {
                this.quickCheckinBtnEl.disabled = false;
                this.quickCheckinBtnEl.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">Yes, I did it!</span>';
                this.quickCheckinStatusEl.textContent = '';
            }
        }
    }

    async handleQuickCheckin() {
        const currentMember = window.firebaseIntegration && window.firebaseIntegration.getCurrentMember();

        if (!currentMember) {
            this.quickCheckinStatusEl.textContent = '❌ Error: Could not identify your account';
            this.quickCheckinStatusEl.className = 'checkin-status error';
            return;
        }

        // Use the same logic as handleCheckin but with the current member's ID
        this.userSelectEl.value = currentMember.id;
        await this.handleCheckin();

        // Update the quick checkin UI
        this.setupCheckinInterface();
    }

    // ========================================
    // STATE MANAGEMENT
    // ========================================
    loadState() {
        const saved = localStorage.getItem('ropedTeamState');
        if (saved) {
            const savedState = JSON.parse(saved);
            this.state = { ...this.state, ...savedState };
        }
    }

    saveState() {
        localStorage.setItem('ropedTeamState', JSON.stringify(this.state));
    }

    // ========================================
    // DAY CALCULATION
    // ========================================
    calculateCurrentDay() {
        const start = new Date(this.state.startDate);
        const today = new Date();
        const diffTime = Math.abs(today - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        this.state.currentDay = Math.min(diffDays, this.state.goalDays);
    }

    setupDailyReset() {
        // Check if we need to move to next day
        const lastCheckDate = localStorage.getItem('lastCheckDate');
        const today = new Date().toISOString().split('T')[0];

        if (lastCheckDate !== today) {
            localStorage.setItem('lastCheckDate', today);
            this.calculateCurrentDay();
            this.saveState();
        }
    }

    // ========================================
    // UI RENDERING
    // ========================================
    renderUI() {
        this.renderHeader();
        this.renderFirstAnchorBadge(); // NEW: Render first anchor badge
        this.renderProgressOverview();
        this.renderTeamProgressOverview();
        this.renderRopedTeam();
        this.renderMilestones();
        this.renderFirstAnchorsHistory(); // NEW: Render 30-day history
        this.renderUserSelect();
        this.renderAdminPanel();
        this.setupCheckinInterface(); // ADD THIS LINE
    }

    renderHeader() {
        this.summitPrizeEl.textContent = this.state.summitPrize;
    }

    renderProgressOverview() {
        // Current Day
        this.currentDayEl.textContent = this.state.currentDay;

        // Altitude Progress
        const progress = (this.state.currentDay / this.state.goalDays) * 100;
        this.altitudeValueEl.textContent = `${Math.round(progress)}%`;
        this.altitudeProgressEl.style.width = `${progress}%`;
        this.teamMarkerEl.style.left = `${progress}%`;

        // Base Camps Count
        this.baseCampsCountEl.textContent = this.state.baseCamps.length;

        // Team Streak
        const streak = this.calculateTeamStreak();
        this.teamStreakEl.textContent = streak;

        // Today's Check-ins
        const todayCheckins = this.getTodayCheckins();
        this.todayCheckinsEl.textContent = `${todayCheckins}/8`;
    }

    renderTeamProgressOverview() {
        this.teamProgressGridEl.innerHTML = '';

        this.state.members.forEach(member => {
            const totalCheckins = this.getMemberTotalCheckins(member.id);
            const currentStreak = this.getMemberStreak(member.id);
            const bestStreak = this.getMemberBestStreak(member.id);
            const completionRate = this.getMemberCompletionRate(member.id);
            const isPerfect = completionRate === 100;

            const card = document.createElement('div');
            card.className = `team-member-progress-card ${isPerfect ? 'perfect' : ''} fade-in`;

            // Build calendar HTML
            const calendarHTML = this.buildCompactCalendar(member.id);

            card.innerHTML = `
                <div class="team-member-header">
                    <div class="team-member-avatar-small">${member.emoji}</div>
                    <div class="team-member-info-small">
                        <div class="team-member-name-small">${member.name}</div>
                        <div class="team-member-habit-small">${member.habit}</div>
                    </div>
                </div>
                
                <div class="team-member-mini-stats">
                    <div class="mini-stat">
                        <div class="mini-stat-value">${totalCheckins}</div>
                        <div class="mini-stat-label">Total</div>
                    </div>
                    <div class="mini-stat">
                        <div class="mini-stat-value">${currentStreak}</div>
                        <div class="mini-stat-label">Streak</div>
                    </div>
                    <div class="mini-stat">
                        <div class="mini-stat-value">${bestStreak}</div>
                        <div class="mini-stat-label">Best</div>
                    </div>
                    <div class="mini-stat">
                        <div class="mini-stat-value">${completionRate}%</div>
                        <div class="mini-stat-label">Rate</div>
                    </div>
                </div>
                
                <div class="team-member-calendar-compact">
                    <div class="calendar-compact-title">Last 30 Days</div>
                    <div class="calendar-compact-grid">
                        ${calendarHTML}
                    </div>
                </div>
            `;

            this.teamProgressGridEl.appendChild(card);
        });
    }

    buildCompactCalendar(memberId) {
        let html = '';

        // Show last 30 days or current day, whichever is less
        const daysToShow = Math.min(30, this.state.currentDay);
        const startDay = Math.max(1, this.state.currentDay - daysToShow + 1);

        for (let day = startDay; day <= this.state.currentDay; day++) {
            const isChecked = this.state.checkins[day]?.[memberId] || false;
            const isToday = day === this.state.currentDay;
            const classes = `calendar-day-compact ${isChecked ? 'checked' : 'missed'} ${isToday ? 'today' : ''}`;
            const icon = isChecked ? '✓' : '✗';
            const tooltip = `Day ${day}: ${isChecked ? 'Checked in' : 'Missed'}`;

            html += `<div class="${classes}" title="${tooltip}">${icon}</div>`;
        }

        // Add a few future days to fill the grid
        const futureDaysToShow = Math.min(5, this.state.goalDays - this.state.currentDay);
        for (let i = 1; i <= futureDaysToShow; i++) {
            const futureDay = this.state.currentDay + i;
            html += `<div class="calendar-day-compact future" title="Day ${futureDay}: Future">·</div>`;
        }

        return html;
    }

    renderRopedTeam() {
        this.ropeContainerEl.innerHTML = '';

        this.state.members.forEach(member => {
            const checkedIn = this.isMemberCheckedInToday(member.id);
            const streak = this.getMemberStreak(member.id);
            const isStalled = !checkedIn && this.getTodayCheckins() > 0;

            const card = document.createElement('div');
            card.className = `climber-card ${isStalled ? 'stalled' : ''} fade-in`;

            card.innerHTML = `
                <div class="climber-avatar">${member.emoji}</div>
                <div class="climber-info">
                    <div class="climber-name">${member.name}</div>
                    <div class="climber-habit">${member.habit}</div>
                    <div class="climber-streak">🔥 ${streak} days since last slip</div>
                </div>
                <div class="climber-status ${checkedIn ? 'status-checked' : ''}">
                    ${checkedIn ? '✅' : '❌'}
                </div>
            `;

            this.ropeContainerEl.appendChild(card);
        });
    }

    renderMilestones() {
        this.milestonesGridEl.innerHTML = '';

        const totalWeeks = Math.ceil(this.state.goalDays / 7);

        for (let week = 1; week <= totalWeeks; week++) {
            const achieved = this.state.baseCamps.includes(week);

            const marker = document.createElement('div');
            marker.className = `milestone-marker ${achieved ? 'achieved' : ''}`;

            marker.innerHTML = `
                <div class="milestone-icon">${achieved ? '⛺' : '🏔️'}</div>
                <div class="milestone-label">Week ${week}</div>
            `;

            this.milestonesGridEl.appendChild(marker);
        }
    }

    renderUserSelect() {
        this.userSelectEl.innerHTML = '<option value="">Choose climber...</option>';

        this.state.members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = `${member.emoji} ${member.name}`;
            this.userSelectEl.appendChild(option);
        });
    }

    renderAdminPanel() {
        this.groupNameEl.value = this.state.groupName;
        this.prizeNameEl.value = this.state.summitPrize;

        this.membersListEl.innerHTML = '';

        this.state.members.forEach((member, index) => {
            const group = document.createElement('div');
            group.className = 'member-input-group';

            group.innerHTML = `
                <input type="text" 
                       placeholder="Name" 
                       value="${member.name}" 
                       data-index="${index}" 
                       data-field="name">
                <input type="text" 
                       placeholder="Habit" 
                       value="${member.habit}" 
                       data-index="${index}" 
                       data-field="habit">
                <input type="email" 
                       placeholder="Email Address" 
                       value="${member.email || ''}" 
                       data-index="${index}" 
                       data-field="email">
            `;

            this.membersListEl.appendChild(group);
        });
    }

    // ========================================
    // CHECK-IN LOGIC
    // ========================================
    handleUserSelection() {
        const selectedId = parseInt(this.userSelectEl.value);

        if (!selectedId) {
            this.checkinBtnEl.disabled = true;
            this.checkinStatusEl.textContent = '';
            this.personalProgressSectionEl.classList.add('hidden');
            return;
        }

        const alreadyCheckedIn = this.isMemberCheckedInToday(selectedId);

        if (alreadyCheckedIn) {
            this.checkinBtnEl.disabled = true;
            this.checkinStatusEl.textContent = '✅ Already checked in today!';
            this.checkinStatusEl.className = 'checkin-status success';
        } else {
            this.checkinBtnEl.disabled = false;
            this.checkinStatusEl.textContent = '';
        }

        // Show personal progress for selected user
        this.renderPersonalProgress(selectedId);
    }

    async handleCheckin() {
        const selectedId = parseInt(this.userSelectEl.value);

        if (!selectedId) return;

        // Use Firebase if available, otherwise use localStorage
        if (window.firebaseIntegration) {
            try {
                // Disable button and show loading
                this.checkinBtnEl.disabled = true;
                this.checkinStatusEl.textContent = '⏳ Securing anchor...';
                this.checkinStatusEl.className = 'checkin-status';

                // Create check-in via Firebase
                await window.firebaseIntegration.createCheckin(selectedId);

                // Success message
                this.checkinStatusEl.textContent = '⚓ Anchor Secured! Great job!';
                this.checkinStatusEl.className = 'checkin-status success';

                // Firebase will handle the UI update via real-time listeners
                // But we can still animate
                this.animateCheckin();

            } catch (error) {
                console.error('Check-in error:', error);
                this.checkinStatusEl.textContent = '❌ ' + (error.message || 'Error checking in. Please try again.');
                this.checkinStatusEl.className = 'checkin-status error';
                this.checkinBtnEl.disabled = false;
            }
        } else {
            // Fallback to localStorage (for local testing without Firebase)
            if (!this.state.checkins[this.state.currentDay]) {
                this.state.checkins[this.state.currentDay] = {};
            }

            this.state.checkins[this.state.currentDay][selectedId] = true;

            // Update UI
            this.checkinStatusEl.textContent = '⚓ Anchor Secured! Great job!';
            this.checkinStatusEl.className = 'checkin-status success';
            this.checkinBtnEl.disabled = true;

            // Check if week is complete
            this.checkWeekCompletion();

            // Save and re-render
            this.saveState();
            this.renderUI();

            // Update personal progress if visible
            if (!this.personalProgressSectionEl.classList.contains('hidden')) {
                this.renderPersonalProgress(selectedId);
            }

            // Animation
            this.animateCheckin();
        }
    }

    animateCheckin() {
        // Add a subtle celebration animation
        const cards = document.querySelectorAll('.climber-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = '';
                    card.classList.add('slide-up');
                }, 10);
            }, index * 50);
        });
    }

    // ========================================
    // WEEK COMPLETION & BASE CAMPS
    // ========================================
    checkWeekCompletion() {
        const currentWeek = Math.ceil(this.state.currentDay / 7);
        const weekStart = (currentWeek - 1) * 7 + 1;
        const weekEnd = Math.min(currentWeek * 7, this.state.currentDay);

        // Check if all 8 members checked in for all days of this week
        let weekComplete = true;

        for (let day = weekStart; day <= weekEnd; day++) {
            if (!this.state.checkins[day]) {
                weekComplete = false;
                break;
            }

            const dayCheckins = Object.keys(this.state.checkins[day]).length;
            if (dayCheckins < 8) {
                weekComplete = false;
                break;
            }
        }

        // If week is complete and it's the 7th day, establish base camp
        if (weekComplete && (this.state.currentDay % 7 === 0) && !this.state.baseCamps.includes(currentWeek)) {
            this.state.baseCamps.push(currentWeek);
            this.showCelebration(currentWeek);
        }
    }

    showCelebration(week) {
        this.celebrationTitleEl.textContent = `⛺ Base Camp ${week} Established!`;
        this.celebrationMessageEl.textContent = `The entire team completed a perfect week! Keep climbing to the summit!`;
        this.celebrationModalEl.classList.add('active');
    }

    closeModal() {
        this.celebrationModalEl.classList.remove('active');
    }

    // ========================================
    // HELPER FUNCTIONS
    // ========================================
    isMemberCheckedInToday(memberId) {
        return this.state.checkins[this.state.currentDay]?.[memberId] || false;
    }

    getTodayCheckins() {
        if (!this.state.checkins[this.state.currentDay]) return 0;
        return Object.keys(this.state.checkins[this.state.currentDay]).length;
    }

    getMemberStreak(memberId) {
        let streak = 0;

        for (let day = this.state.currentDay; day >= 1; day--) {
            if (this.state.checkins[day]?.[memberId]) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    calculateTeamStreak() {
        let streak = 0;

        for (let day = this.state.currentDay; day >= 1; day--) {
            const dayCheckins = this.state.checkins[day];

            if (dayCheckins && Object.keys(dayCheckins).length === 8) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    // ========================================
    // PERSONAL PROGRESS TRACKING
    // ========================================
    renderPersonalProgress(memberId) {
        const member = this.state.members.find(m => m.id === memberId);
        if (!member) return;

        // Show the section
        this.personalProgressSectionEl.classList.remove('hidden');

        // Update name
        this.personalProgressNameEl.textContent = `${member.name}'s`;

        // Calculate stats
        const totalCheckins = this.getMemberTotalCheckins(memberId);
        const currentStreak = this.getMemberStreak(memberId);
        const bestStreak = this.getMemberBestStreak(memberId);
        const completionRate = this.getMemberCompletionRate(memberId);

        // Update stats
        this.personalTotalCheckinsEl.textContent = totalCheckins;
        this.personalCurrentStreakEl.textContent = currentStreak;
        this.personalBestStreakEl.textContent = bestStreak;
        this.personalCompletionRateEl.textContent = `${completionRate}%`;

        // Render calendar
        this.renderPersonalCalendar(memberId);
    }

    renderPersonalCalendar(memberId) {
        this.personalCalendarEl.innerHTML = '';

        // Show last 30 days or current day, whichever is less
        const daysToShow = Math.min(30, this.state.currentDay);
        const startDay = Math.max(1, this.state.currentDay - daysToShow + 1);

        for (let day = startDay; day <= this.state.currentDay; day++) {
            const isChecked = this.state.checkins[day]?.[memberId] || false;
            const isToday = day === this.state.currentDay;

            const dayEl = document.createElement('div');
            dayEl.className = `calendar-day ${isChecked ? 'checked' : 'missed'} ${isToday ? 'today' : ''}`;
            dayEl.title = `Day ${day}: ${isChecked ? 'Checked in ✅' : 'Missed ❌'}`;

            dayEl.innerHTML = `
                <div class="day-number">${day}</div>
                <div class="day-icon">${isChecked ? '✅' : '❌'}</div>
            `;

            this.personalCalendarEl.appendChild(dayEl);
        }

        // Add future days to fill the grid nicely
        const futureDaysToShow = Math.min(10, this.state.goalDays - this.state.currentDay);
        for (let i = 1; i <= futureDaysToShow; i++) {
            const futureDay = this.state.currentDay + i;
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day future';
            dayEl.title = `Day ${futureDay}: Future`;

            dayEl.innerHTML = `
                <div class="day-number">${futureDay}</div>
                <div class="day-icon">⏳</div>
            `;

            this.personalCalendarEl.appendChild(dayEl);
        }
    }

    getMemberTotalCheckins(memberId) {
        let total = 0;
        for (let day = 1; day <= this.state.currentDay; day++) {
            if (this.state.checkins[day]?.[memberId]) {
                total++;
            }
        }
        return total;
    }

    getMemberBestStreak(memberId) {
        let bestStreak = 0;
        let currentStreak = 0;

        for (let day = 1; day <= this.state.currentDay; day++) {
            if (this.state.checkins[day]?.[memberId]) {
                currentStreak++;
                bestStreak = Math.max(bestStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }

        return bestStreak;
    }

    getMemberCompletionRate(memberId) {
        if (this.state.currentDay === 0) return 0;
        const total = this.getMemberTotalCheckins(memberId);
        return Math.round((total / this.state.currentDay) * 100);
    }

    // ========================================
    // ADMIN FUNCTIONS
    // ========================================
    toggleAdminPanel() {
        this.adminContentEl.classList.toggle('active');
    }

    async saveSettings() {
        // Update group settings
        this.state.groupName = this.groupNameEl.value;
        this.state.summitPrize = this.prizeNameEl.value;

        // Update members
        const inputs = this.membersListEl.querySelectorAll('input');
        inputs.forEach(input => {
            const index = parseInt(input.dataset.index);
            const field = input.dataset.field;
            this.state.members[index][field] = input.value;
        });

        // Sync to Firebase if available
        if (window.firebaseIntegration && window.firebaseIntegration.currentTeamId) {
            try {
                this.saveSettingsEl.disabled = true;
                this.saveSettingsEl.textContent = '⏳ Syncing...';

                await window.firebaseIntegration.updateTeamSettings({
                    name: this.state.groupName,
                    summitPrize: this.state.summitPrize,
                    members: this.state.members
                });

                this.saveSettingsEl.disabled = false;
                this.saveSettingsEl.textContent = 'Save Settings';
            } catch (error) {
                console.error('Firebase Sync Error:', error);
                alert('❌ Error syncing to cloud: ' + error.message);
                this.saveSettingsEl.disabled = false;
                this.saveSettingsEl.textContent = 'Save Settings';
                return;
            }
        }

        // Save locally and re-render
        this.saveState();
        this.renderUI();

        alert('✅ Settings saved and synced to the cloud!');
    }

    resetProgress() {
        if (!confirm('⚠️ Are you sure you want to reset all progress? This cannot be undone!')) {
            return;
        }

        this.state.currentDay = 1;
        this.state.startDate = new Date().toISOString().split('T')[0];
        this.state.checkins = {};
        this.state.baseCamps = [];
        this.state.weeklyProgress = {};

        localStorage.setItem('lastCheckDate', this.state.startDate);

        this.saveState();
        this.renderUI();

        alert('🔄 Progress has been reset. Start your new expedition!');
    }

    // ========================================
    // FIRST ANCHOR RENDERING
    // ========================================
    renderFirstAnchorBadge() {
        if (!this.firstAnchorBadgeEl) return;

        const firebaseIntegration = window.firebaseIntegration;
        if (!firebaseIntegration) {
            this.firstAnchorBadgeEl.style.display = 'none';
            return;
        }

        const firstAnchor = firebaseIntegration.getFirstAnchorOfDay(this.state.currentDay);

        if (!firstAnchor) {
            this.firstAnchorBadgeEl.style.display = 'none';
            return;
        }

        // Check if current user is the first anchor
        const currentMember = firebaseIntegration.getCurrentMember();
        const isCurrentUser = currentMember && currentMember.id === firstAnchor.memberId;

        this.firstAnchorBadgeEl.style.display = 'block';
        this.firstAnchorBadgeEl.className = `first-anchor-badge ${isCurrentUser ? 'is-me' : ''}`;

        this.firstAnchorBadgeEl.innerHTML = `
            <div class="badge-icon">⚓🏆</div>
            <div class="badge-content">
                <div class="badge-title">First Anchor of the Day!</div>
                <div class="badge-name">${firstAnchor.memberName}</div>
                <div class="badge-subtitle">${isCurrentUser ? 'That\'s you! Amazing dedication! 🎉' : 'Beat you to it today! 💪'}</div>
            </div>
            <div class="badge-decoration">
                <div class="sparkle">✨</div>
                <div class="sparkle">✨</div>
                <div class="sparkle">✨</div>
            </div>
        `;
    }

    renderFirstAnchorsHistory() {
        if (!this.firstAnchorsListEl) return;

        const firebaseIntegration = window.firebaseIntegration;
        if (!firebaseIntegration) {
            this.firstAnchorsListEl.innerHTML = '<p class="no-data">Connect to Firebase to see first anchor history</p>';
            return;
        }

        const firstAnchors = firebaseIntegration.getLast30DaysFirstAnchors();

        if (firstAnchors.length === 0) {
            this.firstAnchorsListEl.innerHTML = '<p class="no-data">No check-ins yet. Be the first anchor today!</p>';
            return;
        }

        // Count first anchors by member
        const anchorCounts = {};
        firstAnchors.forEach(anchor => {
            anchorCounts[anchor.memberName] = (anchorCounts[anchor.memberName] || 0) + 1;
        });

        // Get current user
        const currentMember = firebaseIntegration.getCurrentMember();

        let html = '<div class="first-anchors-summary">';
        html += '<h3>🏆 Leaderboard</h3>';
        html += '<div class="leaderboard">';

        // Sort by count
        const sortedAnchors = Object.entries(anchorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Top 5

        sortedAnchors.forEach(([name, count], index) => {
            const isCurrentUser = currentMember && currentMember.name === name;
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⚓';
            html += `
                <div class="leaderboard-item ${isCurrentUser ? 'is-me' : ''}">
                    <span class="leaderboard-medal">${medal}</span>
                    <span class="leaderboard-name">${name}</span>
                    <span class="leaderboard-count">${count} days</span>
                </div>
            `;
        });

        html += '</div></div>';

        html += '<div class="first-anchors-timeline">';
        html += '<h3>📅 Recent History</h3>';
        html += '<div class="timeline-list">';

        // Show last 10 days
        firstAnchors.slice(0, 10).forEach(anchor => {
            const isCurrentUser = currentMember && currentMember.id === anchor.memberId;
            const isToday = anchor.day === this.state.currentDay;

            html += `
                <div class="timeline-item ${isCurrentUser ? 'is-me' : ''} ${isToday ? 'is-today' : ''}">
                    <div class="timeline-day">Day ${anchor.day}</div>
                    <div class="timeline-name">⚓ ${anchor.memberName}</div>
                    ${isToday ? '<div class="timeline-badge">Today</div>' : ''}
                </div>
            `;
        });

        html += '</div></div>';

        this.firstAnchorsListEl.innerHTML = html;
    }
}

// ========================================
// INITIALIZE APP
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const app = new HabitTrackerApp();

    // Make app globally accessible for debugging
    window.ropedTeamApp = app;

    console.log('🏔️ The Roped Team app initialized successfully!');
});

// ========================================
// SERVICE WORKER (Optional - for PWA)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you want to add PWA capabilities
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}
