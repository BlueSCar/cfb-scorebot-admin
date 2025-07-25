# CFBD Scorebot Admin - Development Plan

## Executive Summary
The CFBD Scorebot Admin is a Discord bot configuration interface for college football game broadcasts. The application works well but has some developer quality of life issues and opportunities for user experience improvements.

## Current State Assessment

### ✅ **Strengths**
- **Core functionality complete**: Full Discord bot configuration workflow
- **Modern tech stack**: Nuxt 3, Vue 3 Composition API, PrimeVue, Express, TypeScript
- **Production ready**: Docker containers with GitHub Actions CI/CD
- **Database architecture**: Well-structured PostgreSQL with Kysely ORM
- **User experience**: Clean, intuitive interface with real-time updates

### 🔧 **Developer Pain Points**
- **Type safety issues**: 13 `@ts-ignore` statements causing development friction
- **No local testing**: Manual testing only, slows down development iterations
- **Error handling**: Generic error responses make debugging difficult
- **Development setup**: Could be more streamlined for future contributors

### 🎯 **User Enhancement Opportunities**
- **Better game discovery**: Search, filtering, and sorting for large game lists
- **Configuration management**: Save/load presets, bulk operations
- **Visual improvements**: Better mobile experience, loading states
- **Discord integration**: Enhanced bot message previews

## Simplified Development Roadmap

### **Phase 1: Developer Quality of Life (2-3 weeks)**

#### 1.1 Fix Type Safety Issues
- **Remove `@ts-ignore` statements** (high impact, low effort)
  - Fix Express request type augmentation in `backend/src/config/types/express.d.ts`
  - Properly type Discord API responses in service layer
  - Add missing parameter types in controllers
- **Improve ESLint configuration**
  - Enable strict TypeScript rules
  - Fix import/export consistency
  - Add auto-fix on save

#### 1.2 Basic Testing Setup
- **Simple test setup** (for development confidence, not coverage goals)
  - Vitest for frontend component tests (just key components)
  - Basic API endpoint tests with Supertest
  - Simple E2E test for happy path flow
- **Development database setup**
  - Docker compose for local development
  - Seed scripts for test data

#### 1.3 Better Error Handling
- **User-friendly error messages**
  - Replace generic 500 errors with specific messages
  - Toast notifications for user feedback
  - Better loading states and error boundaries
- **Developer debugging**
  - Structured console logging in development
  - Request/response logging for API calls

### **Phase 2: User Experience Improvements (3-4 weeks)**

#### 2.1 Enhanced Game Management
- **Game filtering and search**
  - Search by team name
  - Filter by date range, conference, or status
  - Sort by date, ranking, or alphabetical
- **Bulk operations**
  - Select multiple games at once
  - "Select all conference games" shortcuts
  - Clear all selections

#### 2.2 Configuration Presets
- **Save/load configurations**
  - Save current settings as named presets
  - Quick-load common configurations (e.g., "SEC Games", "Top 25 Matchups")
  - Import/export configurations between servers
- **Smart defaults**
  - Auto-select rivalry games for chosen teams
  - Conference championship auto-selection
  - Playoff/bowl game recommendations

#### 2.3 Visual Polish
- **Mobile responsiveness**
  - Better mobile layout for game table
  - Touch-friendly controls
  - Optimized for Discord mobile app usage
- **Loading and feedback**
  - Skeleton loading for game data
  - Progress indicators for bulk operations
  - Success/error toast notifications

### **Phase 3: Discord Integration Enhancements (2-3 weeks)**

#### 3.1 Bot Message Previews
- **Live preview**
  - Show exactly how bot messages will look
  - Preview different message types (game start, score updates, final)
  - Test message formatting with real game data
- **Message customization**
  - Toggle message components (scores, stats, links)
  - Custom message templates
  - Emoji and formatting options

#### 3.2 Discord Features
- **Enhanced guild management**
  - Show bot permissions status
  - Quick links to invite bot or adjust permissions
  - Channel-specific settings (different channels for different content)
- **Usage insights**
  - Show recent bot activity in selected channel
  - Message count and engagement stats
  - Popular team/conference selections

### **Phase 4: Nice-to-Have Features (1-2 weeks each, as time permits)**

#### 4.1 Data Enhancements
- **Historical data**
  - View past season configurations
  - Reuse previous year's settings
  - Season-over-season comparison
- **Enhanced game info**
  - Show TV/streaming info
  - Weather data for outdoor games
  - Betting lines (if available from CFBD API)

#### 4.2 Admin Features (for the developer)
- **Simple analytics**
  - Most popular teams/conferences
  - Usage patterns and trends
  - Server activity metrics
- **Maintenance tools**
  - Bulk cleanup of inactive configurations
  - Database health checks
  - Simple backup/restore functionality

## Implementation Strategy

### **Start Small, Iterate Fast**
1. **Week 1-2**: Fix TypeScript issues, basic error handling
2. **Week 3-4**: Add basic tests, improve development setup
3. **Week 5-6**: Game filtering and search functionality
4. **Week 7-8**: Configuration presets and bulk operations
5. **Week 9-10**: Mobile improvements and visual polish
6. **Week 11-12**: Bot message previews and Discord enhancements

### **Development Principles**
- **Pragmatic over perfect**: Focus on features that provide immediate value
- **User feedback driven**: Implement based on actual user pain points
- **Developer efficiency**: Tools and improvements that speed up future development
- **Incremental deployment**: Small, frequent releases rather than big bang updates

### **Success Metrics (Simplified)**
- **Developer productivity**: Faster iteration cycles, fewer debugging sessions
- **User satisfaction**: Reduced support requests, positive feedback
- **Code maintainability**: Easier to add new features without breaking existing functionality
- **Stability**: Fewer user-reported bugs and errors

### **Timeline**
- **Total duration**: 3-4 months of part-time work
- **Core improvements**: First 6-8 weeks
- **Polish and enhancements**: Remaining time based on priorities
- **Continuous**: Small improvements and bug fixes as needed

This plan focuses on practical improvements that make the application more enjoyable to develop and use, without over-engineering for scale that may never be needed.