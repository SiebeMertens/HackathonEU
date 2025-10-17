# Quick Test Guide: AI-Enhanced Questions

## Pre-Test Setup

1. **Ensure API Key is Configured**

   ```bash
   # Start the development server
   cd prototype
   npm run dev
   ```

2. **Configure Gemini API Key**
   - Open the app at http://localhost:5174/
   - Click "Enable AI Questions" button
   - Enter your Google AI Studio API key
   - Click "Test Connection" to verify
   - Click "Save"

## Test Scenarios

### Test 1: AI Question Quality & Sources

**Steps**:

1. Start any assessment (Network Security, Secure Coding, or Incident Response)
2. Look for questions with "AI Generated" badge
3. Answer the AI-generated question
4. Review the feedback

**Expected Results**:

- ✓ Question has a title and context
- ✓ Explanation includes ✓ and ✗ markers
- ✓ "Key Learning Points" section appears with 3-4 points
- ✓ "Sources & References" section appears with 2-3 clickable links
- ✓ Links open in new tab when clicked

**Screenshot Checklist**:

- [ ] AI Generated badge visible
- [ ] Title and context displayed
- [ ] Learning points section
- [ ] Sources section with clickable links

---

### Test 2: AI Learning Path Generation

**Steps**:

1. Complete an entire assessment (answer all questions)
2. Wait for results screen to load
3. Look for "AI-Personalized Learning Path" section

**Expected Results**:

- ✓ Loading indicator appears briefly ("Generating personalized learning path...")
- ✓ Personalized feedback summary appears in a highlighted box
- ✓ Learning path organized by topics (e.g., "Intermediate Network Security")
- ✓ Each topic has 3-4 resource cards
- ✓ Resource cards show:
  - Number indicator
  - Resource title
  - Resource type (course, documentation, lab, article)
  - Truncated URL
  - Chevron icon on hover
- ✓ Clicking a resource opens it in a new tab

**Screenshot Checklist**:

- [ ] AI-Personalized Learning Path header with sparkles icon
- [ ] Feedback summary in colored box
- [ ] Topic sections with resource cards
- [ ] Hover effect on resource cards

---

### Test 3: Fallback Behavior (No API Key)

**Steps**:

1. Remove API key: Click "Configure" → Clear the key → Save
2. Start an assessment
3. Complete the assessment

**Expected Results**:

- ✓ No "AI Generated" badges on questions
- ✓ Only local/scenario questions are shown
- ✓ Results screen shows "Your Learning Path" (not "AI-Personalized")
- ✓ Standard recommendations displayed (text-based, not clickable)

**Screenshot Checklist**:

- [ ] No AI badges during assessment
- [ ] Standard learning path on results

---

### Test 4: Different Performance Levels

**Steps**:

1. Test with AI enabled
2. Complete three assessments with different performance:
   - **Low score** (< 60%): Answer most questions incorrectly
   - **Medium score** (60-79%): Answer half correctly
   - **High score** (≥ 80%): Answer most correctly

**Expected Results**:

- ✓ Low score: Learning path focuses on fundamentals
- ✓ Medium score: Learning path focuses on intermediate topics
- ✓ High score: Learning path focuses on advanced topics and certifications
- ✓ Feedback summary is personalized to performance level

---

### Test 5: Source Links Validation

**Steps**:

1. Answer an AI-generated question
2. Click each source link in the "Sources & References" section
3. Verify the links work

**Expected Results**:

- ✓ All source links open in new tabs
- ✓ Links go to reputable sources (NIST, ENISA, OWASP, etc.)
- ✓ No broken links (404 errors)

**Note**: AI-generated URLs may occasionally be invalid. If this happens frequently, the AI prompt may need adjustment.

---

### Test 6: Learning Path Resource Links

**Steps**:

1. Complete assessment with AI enabled
2. On results screen, click each resource link in the AI learning path
3. Verify resources are relevant and accessible

**Expected Results**:

- ✓ All resource links open in new tabs
- ✓ Resources are relevant to the topic
- ✓ Mix of resource types (courses, documentation, labs, articles)
- ✓ No broken links

---

### Test 7: UI/UX Polish

**Steps**:

1. Go through an entire assessment flow with AI enabled
2. Pay attention to visual details

**Expected Results**:

- ✓ Icons display correctly (sparkles, globe, book, target, chevron)
- ✓ Color scheme is consistent (cyan/purple gradient for AI features)
- ✓ Hover effects work on resource links
- ✓ Text is readable and well-formatted
- ✓ Loading indicators appear when appropriate
- ✓ No UI glitches or layout issues

---

### Test 8: Error Handling

**Steps**:

1. Enter an invalid API key
2. Try to start an assessment
3. Observe behavior

**Expected Results**:

- ✓ Invalid API key shows error message during testing
- ✓ Assessment still works (falls back to local questions)
- ✓ No crashes or broken UI

---

## Quick Verification Checklist

### AI Questions

- [ ] AI badge appears on generated questions
- [ ] Questions have title and context
- [ ] Explanations include ✓/✗ markers
- [ ] Learning points section visible
- [ ] Sources section with clickable links

### AI Learning Path

- [ ] Loading indicator appears
- [ ] Personalized feedback summary shows
- [ ] Topics organized clearly
- [ ] Resource cards are clickable
- [ ] Resource cards show title, type, and URL
- [ ] Hover effects work

### Fallback

- [ ] Works without API key
- [ ] Standard learning path displayed when AI disabled
- [ ] No errors or crashes

### Visual Polish

- [ ] Icons render correctly
- [ ] Colors are consistent
- [ ] Layout is responsive
- [ ] Text is readable

---

## Troubleshooting

### Issue: AI questions don't appear

- **Check**: API key is configured and valid
- **Check**: "AI Questions Enabled" badge shows on home screen
- **Try**: Reconfigure API key and test connection

### Issue: Sources don't show

- **Check**: Question has `sources` property
- **Try**: Regenerate questions (start new assessment)
- **Note**: Older cached questions may not have sources

### Issue: Learning path doesn't generate

- **Check**: Browser console for errors
- **Check**: API key is still valid
- **Try**: Refresh page and complete assessment again

### Issue: Links don't work

- **Note**: AI-generated URLs are not always perfect
- **Check**: URL format looks correct
- **Report**: If consistent, AI prompt may need tuning

---

## Success Criteria

✅ **All tests pass**:

- AI questions include all required elements
- Sources are clickable and functional
- Learning path generates and displays correctly
- Fallback works without errors
- UI is polished and professional

🎉 **Feature is ready for production!**
