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
            weeklyProgress: {}, // { week: { memberId: [days completed] } }
            majorMilestones: {
                milestone25: { name: 'Quarter Summit', reward: 'Team Lunch', achieved: false },
                milestone50: { name: 'Halfway Peak', reward: 'Movie Night', achieved: false },
                milestone75: { name: 'Final Ascent', reward: 'Adventure Day', achieved: false },
                milestone100: { name: 'SUMMIT!', reward: 'Grand Celebration', achieved: false }
            }
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

        // Reset Start Date Tool
        this.newStartDateEl = document.getElementById('newStartDate');
        this.resetStartDateBtnEl = document.getElementById('resetStartDateBtn');
        this.resetStartStatusEl = document.getElementById('resetStartStatus');

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

        // Time Patterns
        this.personalTimePatternsEl = document.getElementById('personalTimePatterns');

        // Camps Collapse Toggle
        this.campsToggleEl = document.getElementById('campsToggle');
        this.milestonesGridEl = document.getElementById('milestonesGrid');

        // Mountain Trail Elements
        this.mountainTrailContainerEl = document.getElementById('mountainTrailContainer');
        this.progressNarrativeEl = document.getElementById('progressNarrative');
        this.trailDayEl = document.getElementById('trailDay');
        this.trailTotalEl = document.getElementById('trailTotal');
        this.trailAltitudeEl = document.getElementById('trailAltitude');
        this.teammateCountEl = document.getElementById('teammateCount');
        this.teamToggleEl = document.getElementById('teamToggle');
        this.teamLegendEl = document.getElementById('teamLegend');
        this.expandTrailBtnEl = document.getElementById('expandTrailBtn');
        this.srProgressEl = document.getElementById('srProgress');
        this.srDayEl = document.getElementById('srDay');
        this.srTotalEl = document.getElementById('srTotal');

        // Trail state
        this.trailState = {
            isExpanded: false,
            showTeammates: false,
            cachedPathLength: null,
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            isLowEndDevice: navigator.hardwareConcurrency < 4
        };
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

        // Team Size Update
        const updateTeamSizeBtn = document.getElementById('updateTeamSizeBtn');
        if (updateTeamSizeBtn) {
            updateTeamSizeBtn.addEventListener('click', () => this.updateTeamSize());
        }

        // Reset Start Date
        if (this.resetStartDateBtnEl) {
            this.resetStartDateBtnEl.addEventListener('click', () => this.handleResetStartDate());
        }

        // Camps Collapse Toggle
        if (this.campsToggleEl) {
            this.campsToggleEl.addEventListener('click', () => this.toggleCampsSection());
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

        // Setup checkin interface to show/hide admin button based on role
        // This needs to be called after Firebase has loaded team data
        setTimeout(() => {
            if (this.setupCheckinInterface) {
                this.setupCheckinInterface();
            }
        }, 500); // Small delay to ensure team data is loaded
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
        this.renderMountainTrail(); // Mountain Trail Progress
        this.renderProgressOverview();
        this.renderTeamProgressOverview();
        this.renderRopedTeam();
        this.renderMilestones();
        this.renderFirstAnchorsHistory(); // NEW: Render 30-day history
        this.renderUserSelect();
        this.renderAdminPanel();
        this.setupCheckinInterface(); // ADD THIS LINE
        this.setupTrailInteractions(); // Mountain Trail interactions
    }

    renderHeader() {
        this.summitPrizeEl.textContent = this.state.summitPrize;
    }

    renderProgressOverview() {
        // Base Camps Count
        this.baseCampsCountEl.textContent = this.state.baseCamps.length;

        // Team Streak
        const streak = this.calculateTeamStreak();
        this.teamStreakEl.textContent = streak;

        // Today's Check-ins
        const todayCheckins = this.getTodayCheckins();
        this.todayCheckinsEl.textContent = `${todayCheckins}/${this.state.members.length}`;

        // Update trail stats
        if (this.trailDayEl) {
            this.trailDayEl.textContent = this.state.currentDay;
        }
        if (this.trailTotalEl) {
            this.trailTotalEl.textContent = this.state.goalDays;
        }
        if (this.trailAltitudeEl) {
            const progress = (this.state.currentDay / this.state.goalDays) * 100;
            this.trailAltitudeEl.textContent = `${Math.round(progress)}%`;
        }

        // Update screen reader elements
        if (this.srProgressEl) {
            this.srProgressEl.textContent = Math.round((this.state.currentDay / this.state.goalDays) * 100);
        }
        if (this.srDayEl) {
            this.srDayEl.textContent = this.state.currentDay;
        }
        if (this.srTotalEl) {
            this.srTotalEl.textContent = this.state.goalDays;
        }

        // Update teammate count
        if (this.teammateCountEl) {
            this.teammateCountEl.textContent = this.state.members.length - 1;
        }
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

        // Calculate major milestone weeks (25%, 50%, 75%, 100%)
        const milestone25Week = Math.round(totalWeeks * 0.25);
        const milestone50Week = Math.round(totalWeeks * 0.50);
        const milestone75Week = Math.round(totalWeeks * 0.75);
        const milestone100Week = totalWeeks;

        for (let week = 1; week <= totalWeeks; week++) {
            const achieved = this.state.baseCamps.includes(week);

            // Check if this is a major milestone week
            let isMajor = false;
            let milestoneLabel = '';
            let milestoneIcon = '🏔️';

            if (week === milestone25Week) {
                isMajor = true;
                milestoneLabel = '25% - Quarter Summit';
                milestoneIcon = achieved ? '🏔️' : '⛰️';
            } else if (week === milestone50Week) {
                isMajor = true;
                milestoneLabel = '50% - Halfway Peak';
                milestoneIcon = achieved ? '⛰️' : '🗻';
            } else if (week === milestone75Week) {
                isMajor = true;
                milestoneLabel = '75% - Final Ascent';
                milestoneIcon = achieved ? '🎯' : '🎪';
            } else if (week === milestone100Week) {
                isMajor = true;
                milestoneLabel = '100% - SUMMIT!';
                milestoneIcon = achieved ? '🏆' : '👑';
            }

            const marker = document.createElement('div');
            marker.className = `milestone-marker ${achieved ? 'achieved' : ''} ${isMajor ? 'major-milestone' : ''}`;

            if (isMajor) {
                marker.innerHTML = `
                    <div class="milestone-icon" style="font-size: 2.5rem;">${milestoneIcon}</div>
                    <div class="milestone-label" style="font-weight: 700;">${milestoneLabel}</div>
                    <div class="milestone-week" style="font-size: 0.75rem; opacity: 0.8;">Week ${week}</div>
                `;
            } else {
                marker.innerHTML = `
                    <div class="milestone-icon">${achieved ? '⛺' : '🏔️'}</div>
                    <div class="milestone-label">Week ${week}</div>
                `;
            }

            this.milestonesGridEl.appendChild(marker);
        }
    }

    // ========================================
    // MOUNTAIN TRAIL PROGRESS
    // ========================================

    renderMountainTrail() {
        if (!this.mountainTrailContainerEl) return;

        // Generate SVG structure
        const svg = this.createTrailSVG();

        // Clear existing SVG (keep fog and glow overlays)
        const existingSvg = this.mountainTrailContainerEl.querySelector('.trail-svg');
        if (existingSvg) {
            existingSvg.remove();
        }

        // Insert SVG before the overlays
        this.mountainTrailContainerEl.insertBefore(svg, this.mountainTrailContainerEl.firstChild);

        // Calculate and cache path length
        const pathElement = svg.querySelector('.trail-path-bg');
        if (pathElement) {
            this.trailState.cachedPathLength = pathElement.getTotalLength();
        }

        // Render progress stroke
        this.updateProgressStroke();

        // Update narrative
        this.updateProgressNarrative();
    }

    createTrailSVG() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 800 500');
        svg.setAttribute('class', 'trail-svg');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', `Expedition progress: Day ${this.state.currentDay} of ${this.state.goalDays}`);

        // Accessibility title and description
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `Team expedition progress: ${this.state.currentDay} out of ${this.state.goalDays} days`;
        svg.appendChild(title);

        const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
        desc.textContent = 'Visual mountain trail showing team journey from base camp to summit';
        svg.appendChild(desc);

        // Add gradient definition
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <linearGradient id="trailGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#fbbf24;stop-opacity:1" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        `;
        svg.appendChild(defs);

        // Generate trail path
        const pathData = this.generateTrailPath();

        // Add background path (dotted trail)
        const bgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        bgPath.setAttribute('d', pathData);
        bgPath.setAttribute('class', 'trail-path-bg');
        svg.appendChild(bgPath);

        // Add progress path
        const progressPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        progressPath.setAttribute('d', pathData);
        progressPath.setAttribute('class', 'trail-path-progress');
        progressPath.setAttribute('id', 'trailProgressPath');
        svg.appendChild(progressPath);

        // Add camp markers
        this.placeCampMarkers(svg);

        // Add milestone markers
        this.placeMilestoneMarkers(svg);

        // Add user marker
        this.placeUserMarker(svg);

        // Add base camp and summit labels
        this.placeTrailLabels(svg);

        // Add team markers (hidden by default)
        this.placeTeamMarkers(svg);

        return svg;
    }

    generateTrailPath() {
        // Trail points defining the zig-zag path (bottom to top)
        const points = [
            { x: 100, y: 450 },   // Base Camp (Day 0)
            { x: 250, y: 380 },   // First turn
            { x: 450, y: 320 },   // ~Day 30
            { x: 600, y: 250 },   // Halfway Peak (Day 45)
            { x: 500, y: 180 },   // ~Day 60
            { x: 650, y: 100 },   // ~Day 75
            { x: 700, y: 50 }     // Summit (Day 90)
        ];

        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];

            // Control points for smooth bezier curves
            const cp1x = prev.x + (curr.x - prev.x) * 0.5;
            const cp1y = prev.y;
            const cp2x = prev.x + (curr.x - prev.x) * 0.5;
            const cp2y = curr.y;

            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
        }

        return path;
    }

    calculateTrailPosition(day, totalDays) {
        if (!this.trailState.cachedPathLength) return { x: 100, y: 450 };

        const percentage = Math.min(day / totalDays, 1);
        const targetLength = this.trailState.cachedPathLength * percentage;

        const pathElement = document.querySelector('.trail-path-bg');
        if (!pathElement) return { x: 100, y: 450 };

        const point = pathElement.getPointAtLength(targetLength);
        return { x: point.x, y: point.y };
    }

    updateProgressStroke() {
        const progressPath = document.getElementById('trailProgressPath');
        if (!progressPath || !this.trailState.cachedPathLength) return;

        const pathLength = this.trailState.cachedPathLength;
        const percentage = (this.state.currentDay / this.state.goalDays) * 100;
        const dashLength = (percentage / 100) * pathLength;

        progressPath.style.strokeDasharray = `${dashLength} ${pathLength}`;
    }

    placeUserMarker(svg) {
        const position = this.calculateTrailPosition(this.state.currentDay, this.state.goalDays);

        const marker = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        marker.setAttribute('class', this.trailState.prefersReducedMotion ? 'user-marker' : 'user-marker user-marker-pulse');
        marker.setAttribute('transform', `translate(${position.x}, ${position.y})`);
        marker.setAttribute('id', 'userTrailMarker');

        // Avatar circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '22');
        circle.setAttribute('fill', '#fbbf24');
        circle.setAttribute('stroke', 'white');
        circle.setAttribute('stroke-width', '3');
        circle.setAttribute('class', 'user-marker-circle');

        // Hiker emoji
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dy', '0.35em');
        text.setAttribute('font-size', '24');
        text.textContent = '🥾';

        marker.appendChild(circle);
        marker.appendChild(text);
        svg.appendChild(marker);
    }

    placeCampMarkers(svg) {
        const totalWeeks = Math.ceil(this.state.goalDays / 7);
        const majorWeeks = [
            Math.round(totalWeeks * 0.25),
            Math.round(totalWeeks * 0.50),
            Math.round(totalWeeks * 0.75),
            totalWeeks
        ];

        for (let week = 1; week <= totalWeeks; week++) {
            // Skip major milestone weeks (they get special markers)
            if (majorWeeks.includes(week)) continue;

            const day = week * 7;
            if (day > this.state.goalDays) break;

            const position = this.calculateTrailPosition(day, this.state.goalDays);
            const established = this.state.baseCamps.includes(week);

            const camp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            camp.setAttribute('class', `camp-marker ${established ? 'established' : ''}`);
            camp.setAttribute('transform', `translate(${position.x}, ${position.y})`);
            camp.setAttribute('tabindex', '0');
            camp.setAttribute('role', 'button');
            camp.setAttribute('aria-label', `Week ${week} · Day ${day} ${established ? '(Established)' : ''}`);

            const campCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            campCircle.setAttribute('r', '12');
            campCircle.setAttribute('fill', established ? 'rgba(16, 185, 129, 0.8)' : 'rgba(71, 85, 105, 0.6)');
            campCircle.setAttribute('stroke', established ? '#10b981' : '#64748b');
            campCircle.setAttribute('stroke-width', '2');

            const campText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            campText.setAttribute('text-anchor', 'middle');
            campText.setAttribute('dy', '0.35em');
            campText.setAttribute('font-size', '14');
            campText.textContent = established ? '⛺' : '🏔️';

            camp.appendChild(campCircle);
            camp.appendChild(campText);
            svg.appendChild(camp);
        }
    }

    placeMilestoneMarkers(svg) {
        const milestones = [
            { percentage: 25, label: 'Quarter Summit', emoji: '🎯', reached: false },
            { percentage: 50, label: 'Halfway Peak', emoji: '⛰️', reached: false },
            { percentage: 75, label: 'Final Ascent', emoji: '🚩', reached: false },
            { percentage: 100, label: 'Summit', emoji: '🏔️', reached: false }
        ];

        milestones.forEach(milestone => {
            const day = Math.round((milestone.percentage / 100) * this.state.goalDays);
            const position = this.calculateTrailPosition(day, this.state.goalDays);
            const reached = this.state.currentDay >= day;

            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            marker.setAttribute('class', `major-milestone ${reached ? 'reached' : ''}`);
            marker.setAttribute('transform', `translate(${position.x}, ${position.y})`);
            marker.setAttribute('tabindex', '0');
            marker.setAttribute('role', 'button');
            marker.setAttribute('aria-label', `${milestone.label} at ${milestone.percentage}% ${reached ? '(Reached)' : ''}`);

            // Larger circle for milestones
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', '18');
            circle.setAttribute('fill', reached ? '#fbbf24' : '#475569');
            circle.setAttribute('stroke', reached ? '#fbbf24' : '#64748b');
            circle.setAttribute('stroke-width', '3');
            if (reached && !this.trailState.isLowEndDevice) {
                circle.setAttribute('filter', 'url(#glow)');
            }

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dy', '0.35em');
            text.setAttribute('font-size', '18');
            text.textContent = milestone.emoji;

            // Label below
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('class', 'milestone-label');
            label.setAttribute('y', '32');
            label.setAttribute('font-size', '10');
            label.setAttribute('fill', reached ? '#fbbf24' : '#94a3b8');
            label.textContent = milestone.label;

            marker.appendChild(circle);
            marker.appendChild(text);
            marker.appendChild(label);
            svg.appendChild(marker);
        });
    }

    placeTrailLabels(svg) {
        // Base Camp label
        const baseLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        baseLabel.setAttribute('class', 'trail-label basecamp-label');
        baseLabel.setAttribute('x', '100');
        baseLabel.setAttribute('y', '485');
        baseLabel.textContent = '⛺ Base Camp';
        svg.appendChild(baseLabel);

        // Summit label
        const summitLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        summitLabel.setAttribute('class', 'trail-label summit-label');
        summitLabel.setAttribute('x', '700');
        summitLabel.setAttribute('y', '25');
        summitLabel.textContent = '🏔️ Summit';
        svg.appendChild(summitLabel);
    }

    placeTeamMarkers(svg) {
        const teammateColors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
        const currentMember = window.firebaseIntegration && window.firebaseIntegration.getCurrentMember();
        const currentMemberId = currentMember ? currentMember.id : null;

        this.state.members.forEach((member, index) => {
            // Skip current user (they have the main marker)
            if (member.id === currentMemberId) return;

            // Calculate member's progress (simplified - using streak as proxy)
            const memberStreak = this.getMemberStreak(member.id);
            const memberDay = Math.min(memberStreak, this.state.currentDay);
            const position = this.calculateTrailPosition(memberDay, this.state.goalDays);
            const checkedInToday = this.isMemberCheckedInToday(member.id);
            const color = teammateColors[index % teammateColors.length];

            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            marker.setAttribute('class', 'team-marker-small');
            marker.setAttribute('transform', `translate(${position.x}, ${position.y})`);
            marker.setAttribute('data-teammate-id', member.id);

            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot.setAttribute('r', '10');
            dot.setAttribute('fill', color);
            dot.setAttribute('stroke', checkedInToday ? '#10b981' : 'white');
            dot.setAttribute('stroke-width', checkedInToday ? '3' : '2');
            dot.setAttribute('class', `team-marker-dot ${checkedInToday ? 'checked-in' : ''}`);

            const emoji = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            emoji.setAttribute('text-anchor', 'middle');
            emoji.setAttribute('dy', '0.35em');
            emoji.setAttribute('font-size', '12');
            emoji.textContent = member.emoji;

            marker.appendChild(dot);
            marker.appendChild(emoji);
            svg.appendChild(marker);
        });
    }

    updateProgressNarrative() {
        if (!this.progressNarrativeEl) return;

        const day = this.state.currentDay;
        const goalDays = this.state.goalDays;
        const percentage = (day / goalDays) * 100;

        let narrative = '';

        if (day === 0) {
            narrative = "🥾 Your expedition begins! Take your first step today.";
        } else if (day <= 7) {
            narrative = `You've climbed ${day} days together — Base Camp is behind you.`;
        } else if (percentage < 25) {
            narrative = "Approaching Quarter Summit — consistency matters now.";
        } else if (percentage < 50) {
            narrative = "The trail steepens ahead — your team's momentum is building.";
        } else if (percentage < 75) {
            narrative = "Halfway Peak conquered! The summit is within sight.";
        } else if (percentage < 100) {
            narrative = "Final ascent — every step counts toward the summit.";
        } else {
            narrative = "🏔️ Summit reached! You've completed the expedition together.";
        }

        this.progressNarrativeEl.textContent = narrative;
    }

    setupTrailInteractions() {
        // Expand/collapse button
        if (this.expandTrailBtnEl) {
            this.expandTrailBtnEl.addEventListener('click', () => this.toggleTrailExpansion());
        }

        // Team toggle
        if (this.teamToggleEl) {
            this.teamToggleEl.addEventListener('click', () => this.toggleTeamMarkers());
            this.teamToggleEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTeamMarkers();
                }
            });
        }
    }

    toggleTrailExpansion() {
        if (!this.mountainTrailContainerEl) return;

        this.trailState.isExpanded = !this.trailState.isExpanded;
        this.mountainTrailContainerEl.classList.toggle('expanded', this.trailState.isExpanded);

        if (this.expandTrailBtnEl) {
            this.expandTrailBtnEl.textContent = this.trailState.isExpanded
                ? 'Collapse Journey'
                : 'Explore Full Journey';
            this.expandTrailBtnEl.setAttribute('aria-expanded', this.trailState.isExpanded);
        }
    }

    toggleTeamMarkers() {
        this.trailState.showTeammates = !this.trailState.showTeammates;

        const markers = document.querySelectorAll('.team-marker-small');
        markers.forEach(marker => {
            marker.classList.toggle('visible', this.trailState.showTeammates);
        });

        if (this.teamLegendEl) {
            this.teamLegendEl.classList.toggle('visible', this.trailState.showTeammates);
            this.teamLegendEl.setAttribute('aria-hidden', !this.trailState.showTeammates);

            if (this.trailState.showTeammates) {
                this.renderTeamLegend();
            }
        }

        if (this.teamToggleEl) {
            this.teamToggleEl.classList.toggle('active', this.trailState.showTeammates);
            this.teamToggleEl.setAttribute('aria-pressed', this.trailState.showTeammates);
        }
    }

    renderTeamLegend() {
        if (!this.teamLegendEl) return;

        const teammateColors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
        const currentMember = window.firebaseIntegration && window.firebaseIntegration.getCurrentMember();
        const currentMemberId = currentMember ? currentMember.id : null;

        let legendHTML = '';

        this.state.members.forEach((member, index) => {
            if (member.id === currentMemberId) return;

            const checkedInToday = this.isMemberCheckedInToday(member.id);
            const color = teammateColors[index % teammateColors.length];
            const status = checkedInToday ? '✅ Anchored' : '⏳ Climbing';

            legendHTML += `
                <div class="team-legend-item">
                    <div class="team-legend-dot ${checkedInToday ? 'checked-in' : ''}" 
                         style="background-color: ${color}"></div>
                    <span class="team-legend-name">${member.emoji} ${member.name}</span>
                    <span class="team-legend-status">${status}</span>
                </div>
            `;
        });

        this.teamLegendEl.innerHTML = legendHTML;
    }

    animateCheckinOnTrail() {
        if (this.trailState.prefersReducedMotion) {
            this.renderMountainTrail();
            return;
        }

        const userMarker = document.getElementById('userTrailMarker');
        if (!userMarker) return;

        const newPosition = this.calculateTrailPosition(this.state.currentDay, this.state.goalDays);

        userMarker.style.transition = 'transform 0.5s ease-out';
        userMarker.setAttribute('transform', `translate(${newPosition.x}, ${newPosition.y})`);

        // Update progress stroke
        setTimeout(() => {
            this.updateProgressStroke();
            this.updateProgressNarrative();
        }, 500);

        // Check for milestone celebration
        const percentage = (this.state.currentDay / this.state.goalDays) * 100;
        if (percentage === 25 || percentage === 50 || percentage === 75 || percentage === 100) {
            this.triggerMilestoneCelebration();
        }
    }

    triggerMilestoneCelebration() {
        if (this.trailState.prefersReducedMotion || this.trailState.isLowEndDevice) return;

        // Simple confetti effect
        const container = document.createElement('div');
        container.className = 'confetti-container';
        this.mountainTrailContainerEl.appendChild(container);

        const colors = ['#fbbf24', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 30}%`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDelay = `${Math.random() * 0.5}s`;

            setTimeout(() => {
                particle.classList.add('active');
            }, 100);

            container.appendChild(particle);
        }

        // Clean up after animation
        setTimeout(() => {
            container.remove();
        }, 3000);
    }

    renderUserSelect() {
        this.userSelectEl.innerHTML = '<option value="">Choose climber...</option>';

        // Get current member if logged in
        const currentMember = window.firebaseIntegration && window.firebaseIntegration.getCurrentMember();

        this.state.members.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = `${member.emoji} ${member.name}`;
            this.userSelectEl.appendChild(option);
        });

        // Auto-select current user if they're linked to a member
        if (currentMember) {
            this.userSelectEl.value = currentMember.id;
            // Trigger the selection to show personal progress
            this.handleUserSelection();
        }
    }

    renderAdminPanel() {
        this.groupNameEl.value = this.state.groupName;
        this.prizeNameEl.value = this.state.summitPrize;


        // Set goal weeks (convert days to weeks)
        const currentWeeks = Math.round(this.state.goalDays / 7);
        const goalWeeksEl = document.getElementById('goalWeeks');
        if (goalWeeksEl) {
            goalWeeksEl.value = currentWeeks;
        }

        // Set team size
        const teamSizeEl = document.getElementById('teamSize');
        const currentTeamSizeEl = document.getElementById('currentTeamSize');
        if (teamSizeEl) {
            teamSizeEl.value = this.state.members.length;
        }
        if (currentTeamSizeEl) {
            currentTeamSizeEl.textContent = this.state.members.length;
        }

        // Set milestone rewards
        if (this.state.majorMilestones) {
            const reward25El = document.getElementById('reward25');
            const reward50El = document.getElementById('reward50');
            const reward75El = document.getElementById('reward75');
            const reward100El = document.getElementById('reward100');

            if (reward25El && this.state.majorMilestones.milestone25) {
                reward25El.value = this.state.majorMilestones.milestone25.reward || '';
            }
            if (reward50El && this.state.majorMilestones.milestone50) {
                reward50El.value = this.state.majorMilestones.milestone50.reward || '';
            }
            if (reward75El && this.state.majorMilestones.milestone75) {
                reward75El.value = this.state.majorMilestones.milestone75.reward || '';
            }
            if (reward100El && this.state.majorMilestones.milestone100) {
                reward100El.value = this.state.majorMilestones.milestone100.reward || '';
            }
        }

        this.membersListEl.innerHTML = '';


        this.state.members.forEach((member, index) => {
            const status = this.getMemberStatus(member);
            const statusIcon = status.linked ? '✅' : (status.email ? '⏳' : '➕');
            const statusText = status.linked ? 'Linked' : (status.email ? 'Pending' : 'Add email');

            const group = document.createElement('div');
            group.className = 'member-input-group';

            group.innerHTML = `
                <div class="member-status-indicator" title="${statusText}" style="font-size: 1.2em; padding: 0.5rem; min-width: 2rem; text-align: center;">
                    ${statusIcon}
                </div>
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
                       placeholder="Email (for linking)" 
                       value="${member.email || ''}" 
                       data-index="${index}" 
                       data-field="email">
                <button class="delete-member-btn" data-index="${index}" title="Remove member" style="padding: 0.5rem; background: rgba(239, 68, 68, 0.2); border: 1px solid var(--color-danger); border-radius: 4px; color: #FCA5A5; cursor: pointer; font-size: 1.2em;">
                    🗑️
                </button>
            `;

            // Add delete button event listener
            const deleteBtn = group.querySelector('.delete-member-btn');
            deleteBtn.addEventListener('click', () => this.deleteMember(index));

            this.membersListEl.appendChild(group);
        });
    }

    getMemberStatus(member) {
        return {
            linked: !!member.userId,
            email: !!member.email
        };
    }

    async deleteMember(index) {
        const member = this.state.members[index];

        if (!confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
            return;
        }

        // Remove from local state
        this.state.members.splice(index, 1);

        // Update Firebase if connected
        if (window.firebaseIntegration && window.firebaseIntegration.currentTeamId) {
            try {
                await window.firebaseIntegration.updateTeamSettings({
                    members: this.state.members
                });
                console.log('✅ Member removed and synced to Firebase');
            } catch (error) {
                console.error('Error removing member:', error);
                alert('Error removing member: ' + error.message);
                return;
            }
        }

        // Save and re-render
        this.saveState();
        this.renderAdminPanel();
        this.renderUI();
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

        // Check if all members checked in for all days of this week
        let weekComplete = true;

        for (let day = weekStart; day <= weekEnd; day++) {
            if (!this.state.checkins[day]) {
                weekComplete = false;
                break;
            }

            const dayCheckins = Object.keys(this.state.checkins[day]).length;
            if (dayCheckins < this.state.members.length) {
                weekComplete = false;
                break;
            }
        }

        // If week is complete and it's the 7th day, establish base camp
        if (weekComplete && (this.state.currentDay % 7 === 0) && !this.state.baseCamps.includes(currentWeek)) {
            this.state.baseCamps.push(currentWeek);
            this.showCelebration(currentWeek);

            // Check if this week is a major milestone
            this.checkMajorMilestones(currentWeek);
        }
    }

    checkMajorMilestones(week) {
        if (!this.state.majorMilestones) return;

        const totalWeeks = Math.ceil(this.state.goalDays / 7);
        const milestone25Week = Math.round(totalWeeks * 0.25);
        const milestone50Week = Math.round(totalWeeks * 0.50);
        const milestone75Week = Math.round(totalWeeks * 0.75);
        const milestone100Week = totalWeeks;

        let milestoneKey = null;
        let milestoneName = '';
        let reward = '';

        if (week === milestone25Week && !this.state.majorMilestones.milestone25.achieved) {
            milestoneKey = 'milestone25';
            milestoneName = 'Quarter Summit (25%)';
            reward = this.state.majorMilestones.milestone25.reward;
        } else if (week === milestone50Week && !this.state.majorMilestones.milestone50.achieved) {
            milestoneKey = 'milestone50';
            milestoneName = 'Halfway Peak (50%)';
            reward = this.state.majorMilestones.milestone50.reward;
        } else if (week === milestone75Week && !this.state.majorMilestones.milestone75.achieved) {
            milestoneKey = 'milestone75';
            milestoneName = 'Final Ascent (75%)';
            reward = this.state.majorMilestones.milestone75.reward;
        } else if (week === milestone100Week && !this.state.majorMilestones.milestone100.achieved) {
            milestoneKey = 'milestone100';
            milestoneName = 'SUMMIT REACHED! (100%)';
            reward = this.state.majorMilestones.milestone100.reward;
        }

        if (milestoneKey) {
            this.state.majorMilestones[milestoneKey].achieved = true;
            this.showMajorMilestoneCelebration(milestoneName, reward);
            this.saveState();
        }
    }

    showMajorMilestoneCelebration(milestoneName, reward) {
        this.celebrationTitleEl.textContent = `🏔️ ${milestoneName}`;
        this.celebrationMessageEl.innerHTML = `
            <p style="font-size: 1.2em; margin-bottom: 1rem;">Major Milestone Achieved!</p>
            <p style="font-size: 1.5em; color: var(--color-gold);">🎉 ${reward} 🎉</p>
            <p style="margin-top: 1rem; opacity: 0.9;">Keep up the amazing work!</p>
        `;
        this.celebrationModalEl.classList.add('active');

        // Save to Firebase
        if (window.firebaseIntegration && window.firebaseIntegration.currentTeamId) {
            window.firebaseIntegration.updateTeamSettings({
                majorMilestones: this.state.majorMilestones
            });
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

            if (dayCheckins && Object.keys(dayCheckins).length === this.state.members.length) {
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

        // Render time patterns
        this.renderTimePatterns(memberId);

        // Render calendar
        this.renderPersonalCalendar(memberId);
    }

    renderTimePatterns(memberId) {
        if (!this.personalTimePatternsEl) return;

        // Get member's check-ins with timestamps
        const memberCheckins = [];
        if (this.state.checkinDetails) {
            Object.values(this.state.checkinDetails).forEach(dayCheckins => {
                const userCheckin = dayCheckins.find(c => c.memberId === memberId);
                if (userCheckin && userCheckin.timestamp) {
                    memberCheckins.push(userCheckin);
                }
            });
        }

        if (memberCheckins.length === 0) {
            this.personalTimePatternsEl.innerHTML = `
                <div class="time-patterns-empty">
                    <p>⏰ No time data available yet. Complete more check-ins to see your patterns!</p>
                </div>
            `;
            return;
        }

        const timeStats = this.calculateTimeStats(memberCheckins);
        if (!timeStats) return;

        // Calculate percentages for distribution
        const total = timeStats.total;
        const earlyPct = Math.round((timeStats.distribution.early / total) * 100);
        const morningPct = Math.round((timeStats.distribution.morning / total) * 100);
        const middayPct = Math.round((timeStats.distribution.midday / total) * 100);
        const afternoonPct = Math.round((timeStats.distribution.afternoon / total) * 100);

        // Determine most common time
        const maxDist = Math.max(
            timeStats.distribution.early,
            timeStats.distribution.morning,
            timeStats.distribution.midday,
            timeStats.distribution.afternoon
        );
        let mostCommon = '';
        if (timeStats.distribution.early === maxDist) mostCommon = '5-7 AM (Early Bird 🌅)';
        else if (timeStats.distribution.morning === maxDist) mostCommon = '7-9 AM (Morning Person 🌄)';
        else if (timeStats.distribution.midday === maxDist) mostCommon = '9-12 PM (Mid-Morning ☀️)';
        else mostCommon = '12+ PM (Afternoon 🌤️)';

        this.personalTimePatternsEl.innerHTML = `
            <h3>⏰ Check-in Time Patterns</h3>
            <p class="time-patterns-subtitle">Understanding your behavior helps build better habits</p>
            
            <div class="time-stats-grid">
                <div class="time-stat-card">
                    <div class="time-stat-icon">📊</div>
                    <div class="time-stat-content">
                        <div class="time-stat-label">Average Time</div>
                        <div class="time-stat-value">${timeStats.average}</div>
                    </div>
                </div>
                
                <div class="time-stat-card">
                    <div class="time-stat-icon">🌅</div>
                    <div class="time-stat-content">
                        <div class="time-stat-label">Earliest</div>
                        <div class="time-stat-value">${timeStats.earliest.time}</div>
                        <div class="time-stat-day">Day ${timeStats.earliest.day}</div>
                    </div>
                </div>
                
                <div class="time-stat-card">
                    <div class="time-stat-icon">🌆</div>
                    <div class="time-stat-content">
                        <div class="time-stat-label">Latest</div>
                        <div class="time-stat-value">${timeStats.latest.time}</div>
                        <div class="time-stat-day">Day ${timeStats.latest.day}</div>
                    </div>
                </div>
                
                <div class="time-stat-card">
                    <div class="time-stat-icon">⭐</div>
                    <div class="time-stat-content">
                        <div class="time-stat-label">Most Common</div>
                        <div class="time-stat-value-small">${mostCommon}</div>
                    </div>
                </div>
            </div>

            <div class="time-distribution">
                <h4>Time Distribution</h4>
                <div class="distribution-bars">
                    <div class="distribution-item">
                        <div class="distribution-label">🌅 5-7 AM</div>
                        <div class="distribution-bar-container">
                            <div class="distribution-bar" style="width: ${earlyPct}%"></div>
                        </div>
                        <div class="distribution-value">${earlyPct}%</div>
                    </div>
                    
                    <div class="distribution-item">
                        <div class="distribution-label">🌄 7-9 AM</div>
                        <div class="distribution-bar-container">
                            <div class="distribution-bar" style="width: ${morningPct}%"></div>
                        </div>
                        <div class="distribution-value">${morningPct}%</div>
                    </div>
                    
                    <div class="distribution-item">
                        <div class="distribution-label">☀️ 9-12 PM</div>
                        <div class="distribution-bar-container">
                            <div class="distribution-bar" style="width: ${middayPct}%"></div>
                        </div>
                        <div class="distribution-value">${middayPct}%</div>
                    </div>
                    
                    <div class="distribution-item">
                        <div class="distribution-label">🌤️ 12+ PM</div>
                        <div class="distribution-bar-container">
                            <div class="distribution-bar" style="width: ${afternoonPct}%"></div>
                        </div>
                        <div class="distribution-value">${afternoonPct}%</div>
                    </div>
                </div>
            </div>

            <div class="time-insights">
                <h4>💡 Insights</h4>
                <div class="insights-list">
                    ${this.generateTimeInsights(timeStats, memberCheckins)}
                </div>
            </div>
        `;
    }

    generateTimeInsights(timeStats, memberCheckins) {
        const insights = [];

        // Consistency insight
        const times = memberCheckins.map(c => {
            const date = c.timestamp.toDate ? c.timestamp.toDate() : new Date(c.timestamp);
            return date.getHours() * 60 + date.getMinutes();
        });
        const variance = this.calculateVariance(times);

        if (variance < 30) {
            insights.push('<div class="insight-item">✅ You\'re very consistent with your check-in times! This helps build strong habits.</div>');
        } else if (variance > 120) {
            insights.push('<div class="insight-item">💡 Your check-in times vary quite a bit. Try setting a consistent time for better habit formation.</div>');
        }

        // Early bird insight
        if (timeStats.distribution.early > timeStats.total * 0.5) {
            insights.push('<div class="insight-item">🌅 You\'re an early bird! Morning check-ins are linked to better consistency.</div>');
        }

        // Most productive time
        const maxDist = Math.max(
            timeStats.distribution.early,
            timeStats.distribution.morning,
            timeStats.distribution.midday,
            timeStats.distribution.afternoon
        );

        if (timeStats.distribution.morning === maxDist && timeStats.distribution.morning > 3) {
            insights.push('<div class="insight-item">🌄 7-9 AM seems to be your sweet spot! This is a great time for habit building.</div>');
        }

        // Improvement suggestion
        if (memberCheckins.length >= 5) {
            const avgMinutes = times.reduce((a, b) => a + b, 0) / times.length;
            const avgHour = Math.floor(avgMinutes / 60);
            if (avgHour >= 10) {
                insights.push('<div class="insight-item">💪 Consider checking in earlier in the day for better momentum and consistency!</div>');
            }
        }

        return insights.length > 0 ? insights.join('') : '<div class="insight-item">Keep checking in to unlock more insights!</div>';
    }

    calculateVariance(numbers) {
        const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
        const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
        return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length);
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
    updateTeamSize() {
        const teamSizeEl = document.getElementById('teamSize');
        const newSize = parseInt(teamSizeEl.value);

        if (isNaN(newSize) || newSize < 1 || newSize > 30) {
            alert('⚠️ Team size must be between 1 and 30');
            return;
        }

        const currentSize = this.state.members.length;

        if (newSize === currentSize) {
            alert('ℹ️ Team size is already ' + currentSize);
            return;
        }

        if (newSize < currentSize) {
            if (!confirm(`⚠️ This will remove ${currentSize - newSize} member(s) from the team. Continue?`)) {
                return;
            }
        }

        // Add or remove members
        while (this.state.members.length < newSize) {
            this.state.members.push({
                id: this.state.members.length + 1,
                name: '',
                habit: '',
                emoji: '🧗',
                email: ''
            });
        }

        while (this.state.members.length > newSize) {
            this.state.members.pop();
        }

        // Re-render admin panel
        this.renderAdminPanel();

        alert(`✅ Team size updated to ${newSize} members. Remember to Save Settings!`);
    }

    toggleAdminPanel() {
        this.adminContentEl.classList.toggle('active');
    }

    async saveSettings() {
        // Update group settings
        this.state.groupName = this.groupNameEl.value;
        this.state.summitPrize = this.prizeNameEl.value;

        // Update goal weeks/days
        const goalWeeksEl = document.getElementById('goalWeeks');
        if (goalWeeksEl) {
            const weeks = parseInt(goalWeeksEl.value);

            // Validate
            if (isNaN(weeks) || weeks < 4 || weeks > 52) {
                alert('⚠️ Challenge duration must be between 4 and 52 weeks');
                return;
            }

            this.state.goalDays = weeks * 7;
        }

        // Update milestone rewards
        const reward25El = document.getElementById('reward25');
        const reward50El = document.getElementById('reward50');
        const reward75El = document.getElementById('reward75');
        const reward100El = document.getElementById('reward100');

        if (reward25El && this.state.majorMilestones) {
            this.state.majorMilestones.milestone25.reward = reward25El.value || 'Team Lunch';
            this.state.majorMilestones.milestone50.reward = reward50El.value || 'Movie Night';
            this.state.majorMilestones.milestone75.reward = reward75El.value || 'Adventure Day';
            this.state.majorMilestones.milestone100.reward = reward100El.value || 'Grand Celebration';
        }

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
                    goalDays: this.state.goalDays,
                    majorMilestones: this.state.majorMilestones,
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

    async handleResetStartDate() {
        console.log('🔍 Reset Start Date clicked');
        const newStartDate = this.newStartDateEl.value;
        console.log('📅 New start date:', newStartDate);

        if (!newStartDate) {
            this.resetStartStatusEl.textContent = '❌ Please select a new start date';
            this.resetStartStatusEl.style.color = '#FCA5A5';
            return;
        }

        // Note: Browser confirm() dialog is being blocked, so we proceed directly
        // The warning is already shown in the UI above the button
        console.log('⚠️ Proceeding with reset (warning already shown in UI)');

        if (!window.firebaseIntegration) {
            this.resetStartStatusEl.textContent = '❌ Firebase not connected';
            this.resetStartStatusEl.style.color = '#FCA5A5';
            return;
        }

        try {
            this.resetStartDateBtnEl.disabled = true;
            this.resetStartDateBtnEl.textContent = '⏳ Resetting...';
            this.resetStartStatusEl.textContent = 'Processing...';
            this.resetStartStatusEl.style.color = '#B8E6F5';

            const result = await window.firebaseIntegration.resetStartDate(newStartDate);

            this.resetStartStatusEl.textContent = `✅ Start date reset! Deleted ${result.deletedCheckins} old check -in (s).Journey now starts on ${newStartDate}.`;
            this.resetStartStatusEl.style.color = '#10B981';

            // Refresh the page to show updated data
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error('Reset start date error:', error);
            this.resetStartStatusEl.textContent = '❌ Error: ' + error.message;
            this.resetStartStatusEl.style.color = '#FCA5A5';
        } finally {
            this.resetStartDateBtnEl.disabled = false;
            this.resetStartDateBtnEl.textContent = 'Reset Start Date';
        }
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

    toggleCampsSection() {
        if (!this.milestonesGridEl || !this.campsToggleEl) return;

        const isCollapsed = this.milestonesGridEl.classList.contains('collapsed');

        if (isCollapsed) {
            // Expand
            this.milestonesGridEl.classList.remove('collapsed');
            this.campsToggleEl.setAttribute('aria-expanded', 'true');
            this.campsToggleEl.querySelector('.toggle-text').textContent = 'Collapse';
        } else {
            // Collapse
            this.milestonesGridEl.classList.add('collapsed');
            this.campsToggleEl.setAttribute('aria-expanded', 'false');
            this.campsToggleEl.querySelector('.toggle-text').textContent = 'Expand';
        }
    }

    // ========================================
    // TIME UTILITY FUNCTIONS
    // ========================================
    formatTime(timestamp) {
        if (!timestamp) return 'N/A';

        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        const minutesStr = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutesStr} ${ampm} `;
    }

    getTimeContext(memberCheckins, currentTime) {
        if (!memberCheckins || memberCheckins.length === 0) {
            return '';
        }

        // Calculate average time
        const times = memberCheckins.map(c => {
            const date = c.timestamp.toDate ? c.timestamp.toDate() : new Date(c.timestamp);
            return date.getHours() * 60 + date.getMinutes(); // Convert to minutes
        });

        const avgMinutes = times.reduce((a, b) => a + b, 0) / times.length;
        const currentDate = currentTime.toDate ? currentTime.toDate() : new Date(currentTime);
        const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

        const diff = avgMinutes - currentMinutes;

        if (Math.abs(diff) < 15) {
            return 'Right on schedule! ⏰';
        } else if (diff > 30) {
            return `${Math.round(diff)} min earlier than usual! 🌅`;
        } else if (diff < -30) {
            return `${Math.round(Math.abs(diff))} min later than usual`;
        }

        return '';
    }

    calculateTimeStats(memberCheckins) {
        if (!memberCheckins || memberCheckins.length === 0) {
            return null;
        }

        const times = memberCheckins.map(c => {
            const date = c.timestamp.toDate ? c.timestamp.toDate() : new Date(c.timestamp);
            return {
                minutes: date.getHours() * 60 + date.getMinutes(),
                timestamp: c.timestamp,
                day: c.day
            };
        });

        // Calculate average
        const avgMinutes = times.reduce((a, b) => a + b.minutes, 0) / times.length;
        const avgHours = Math.floor(avgMinutes / 60);
        const avgMins = Math.round(avgMinutes % 60);
        const avgAmpm = avgHours >= 12 ? 'PM' : 'AM';
        const avgHours12 = avgHours % 12 || 12;

        // Find earliest and latest
        const sorted = [...times].sort((a, b) => a.minutes - b.minutes);
        const earliest = sorted[0];
        const latest = sorted[sorted.length - 1];

        // Calculate time distribution
        const distribution = {
            early: 0,    // 5-7 AM
            morning: 0,  // 7-9 AM
            midday: 0,   // 9-12 PM
            afternoon: 0 // 12+ PM
        };

        times.forEach(t => {
            const hour = Math.floor(t.minutes / 60);
            if (hour >= 5 && hour < 7) distribution.early++;
            else if (hour >= 7 && hour < 9) distribution.morning++;
            else if (hour >= 9 && hour < 12) distribution.midday++;
            else distribution.afternoon++;
        });

        return {
            average: `${avgHours12}:${avgMins < 10 ? '0' : ''}${avgMins} ${avgAmpm} `,
            earliest: {
                time: this.formatTime(earliest.timestamp),
                day: earliest.day
            },
            latest: {
                time: this.formatTime(latest.timestamp),
                day: latest.day
            },
            distribution: distribution,
            total: times.length
        };
    }

    getTimeOfDayIcon(timestamp) {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const hour = date.getHours();

        if (hour >= 5 && hour < 7) return '🌅';
        if (hour >= 7 && hour < 9) return '🌄';
        if (hour >= 9 && hour < 12) return '☀️';
        if (hour >= 12 && hour < 17) return '🌤️';
        if (hour >= 17 && hour < 20) return '🌆';
        return '🌙';
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

        // Get time and context
        const timeStr = this.formatTime(firstAnchor.timestamp);
        const timeIcon = this.getTimeOfDayIcon(firstAnchor.timestamp);

        // Get time context if it's the current user
        let timeContext = '';
        if (isCurrentUser && this.state.checkinDetails) {
            const userCheckins = [];
            Object.values(this.state.checkinDetails).forEach(dayCheckins => {
                const userCheckin = dayCheckins.find(c => c.memberId === firstAnchor.memberId);
                if (userCheckin) userCheckins.push(userCheckin);
            });
            timeContext = this.getTimeContext(userCheckins, firstAnchor.timestamp);
        }

        this.firstAnchorBadgeEl.style.display = 'block';
        this.firstAnchorBadgeEl.className = `first-anchor-badge ${isCurrentUser ? 'is-me' : ''}`;

        this.firstAnchorBadgeEl.innerHTML = `
            <div class="badge-icon">⚓🏆</div>
            <div class="badge-content">
                <div class="badge-title">First Anchor of the Day!</div>
                <div class="badge-name">${firstAnchor.memberName}</div>
                <div class="badge-time">${timeIcon} ${timeStr}</div>
                ${timeContext ? `<div class="badge-context">${timeContext}</div>` : ''}
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
            const timeStr = this.formatTime(anchor.timestamp);
            const timeIcon = this.getTimeOfDayIcon(anchor.timestamp);

            html += `
            <div class="timeline-item ${isCurrentUser ? 'is-me' : ''} ${isToday ? 'is-today' : ''}">
                    <div class="timeline-day">Day ${anchor.day}</div>
                    <div class="timeline-name">⚓ ${anchor.memberName}</div>
                    <div class="timeline-time">${timeIcon} ${timeStr}</div>
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
