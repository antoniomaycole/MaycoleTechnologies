# Visitor Tracking System

## Overview
The MaycoleTechnologies visitor tracking system provides comprehensive analytics for understanding user behavior, conversions, and engagement on your website.

## Features

### 1. **Automatic Page View Tracking**
- Tracks every page visit automatically
- Records time spent on each page
- Tracks scroll depth per page
- Measures bounce rate

### 2. **User Interaction Tracking**
- Button clicks (with button name tracking)
- Form submissions
- Scroll depth
- User presence (visible/hidden)

### 3. **Session Management**
- Unique session IDs for each visitor
- 30-minute session timeout
- LocalStorage persistence
- Device detection (mobile, tablet, desktop)

### 4. **Conversion Tracking**
- Lead capture conversions
- Product launch clicks
- Form submissions
- Custom event tracking

### 5. **Analytics Dashboard**
- Real-time visitor metrics
- Device breakdown (mobile, desktop, tablet)
- Top pages visited
- Most clicked buttons
- Conversion rate tracking
- Hourly activity graphs

## Usage

### Initialize Tracking (Automatic)
The tracking service is automatically initialized in `App.tsx` when your application loads.

### Track Custom Events
```typescript
import { getVisitorTrackingService } from './services/VisitorTracking';

const tracker = getVisitorTrackingService();

// Track product launch
tracker.trackProductLaunch('MaycoleTracker vol XII');

// Track lead capture
tracker.trackLeadCapture('user@example.com', 'form-source');

// Track custom event
tracker.trackEvent('interaction', 'button_click', {
  buttonText: 'Get Started',
  buttonId: 'cta-btn'
});

// Track page view (auto-tracked in App.tsx)
tracker.trackPageView('Home Page');
```

### Get Session Data
```typescript
const tracker = getVisitorTrackingService();

// Get current session
const session = tracker.getSession();

// Get session summary
const summary = tracker.getSessionSummary();
console.log(summary);
// Output:
// {
//   sessionId: 'visitor_1234567890_abc123',
//   duration: 45000, // ms
//   pageViews: 3,
//   clicks: 12,
//   scrolls: 5,
//   formSubmissions: 1,
//   device: 'desktop',
//   referrer: 'google.com'
// }
```

### Access Analytics Dashboard
Navigate to `/analytics` to view the visitor analytics dashboard.

## Tracked Data

### Session Data
- Session ID (unique identifier)
- Start time
- Last activity time
- Referrer URL
- User Agent
- Device type
- Page views
- Interaction counts

### Events Tracked
1. **Navigation Events**
   - Page views
   - Time on page
   - Scroll depth

2. **Interaction Events**
   - Button clicks
   - Form submissions
   - Scroll activities

3. **Conversion Events**
   - Lead captures
   - Product launches
   - Form submissions

4. **Session Events**
   - Page visibility changes

## API Endpoints

### Track Events
**POST** `/api/analytics/track`
```json
{
  "sessionId": "visitor_...",
  "events": [...],
  "sessionData": {...}
}
```

### Get Metrics
**GET** `/api/analytics/metrics`
Returns real-time analytics metrics

### Get Sessions
**GET** `/api/analytics/sessions?limit=100&offset=0`
Returns paginated sessions list

### Get Session Details
**GET** `/api/analytics/sessions/:sessionId`
Returns specific session data and events

### Get Conversions
**GET** `/api/analytics/conversions`
Returns all conversion events

## Exported Components & Services

### Services
- `VisitorTrackingService` - Main tracking service
- `getVisitorTrackingService()` - Get singleton instance

### Components
- `VisitorAnalyticsDashboard` - Real-time analytics display

## Privacy & Storage

- **LocalStorage**: Session data is stored locally
- **Server**: Analytics are sent to `/api/analytics/track` endpoint
- **Duration**: Sessions expire after 30 minutes of inactivity
- **Scope**: Tracks only non-PII data (except email from lead forms)

## Configuration

### Session Timeout
Edit `VisitorTracking.ts` line 112:
```typescript
const sessionTimeout = 30 * 60 * 1000; // 30 minutes
```

### Flush Interval
Edit `VisitorTracking.ts` line 327:
```typescript
this.queueFlushInterval = setInterval(() => {
  if (this.analyticsQueue.length > 0) {
    this.flush();
  }
}, 30000); // 30 seconds
```

### Backend Endpoint
The system sends analytics to `/api/analytics/track`. Configure your backend to accept this endpoint.

## Monitoring Production

1. **View Live Analytics**: Access the dashboard component
2. **Check Server Logs**: Monitor `/api/analytics/track` endpoint
3. **Database**: Store events in a database for long-term analysis
4. **Alerts**: Set up alerts for conversion anomalies

## Future Enhancements

- [ ] Heatmap visualization
- [ ] Session replay
- [ ] A/B testing integration
- [ ] Cohort analysis
- [ ] User segmentation
- [ ] Custom event filtering
- [ ] Export to external analytics platforms (Google Analytics, Mixpanel, etc.)
- [ ] Real-time alerts for high traffic
