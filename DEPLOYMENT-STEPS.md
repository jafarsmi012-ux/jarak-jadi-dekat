# 🚀 DEPLOYMENT STEPS - Living Together Game

## ⚠️ CRITICAL: Database Setup MUST BE DONE FIRST!

### Step 1: Execute Database Schema (DO THIS NOW!)

1. **Login to Supabase**
   - URL: https://supabase.com/dashboard
   - Project: `hweosezdbayrcvchdvgo`

2. **Open SQL Editor**
   - Left sidebar → "SQL Editor"
   - Click "+ New Query"

3. **Copy & Execute Schema**
   ```
   Open file: tedi-airin-schema.sql
   Copy ALL content
   Paste into SQL Editor
   Click "Run" or press Ctrl+Enter
   ```

4. **Wait for Success**
   - Should see: "Success. No rows returned"
   - Check "Table Editor" → Should see 7 new tables

5. **Verify Initial Data**
   - Open `life_players` table → Should have 2 rows (Tedi, Airin)
   - Open `relationship_stats` → Should have 1 row

---

## Step 2: Merge to Main Branch

```bash
# Switch to main
git checkout main

# Merge the branch
git merge tedi-airin-life-sim

# Push to GitHub
git push origin main
```

**Vercel will auto-deploy!** ✨

---

## Step 3: Verify Deployment

1. **Wait for Vercel Build**
   - Check: https://vercel.com/dashboard
   - Wait for "Deployment Ready"

2. **Test the Game**
   - URL: https://jarak-jadi-dekat.vercel.app
   - Click "Living Together 💕"

3. **Test as Tedi**
   - Click Bandung card
   - Should see status bars
   - Try an activity (e.g., Minum Air)
   - Check if it updates

4. **Test as Airin** (in different browser/incognito)
   - Open same URL
   - Click Padang card
   - Should see Tedi's status on right panel
   - Send a care action
   - Send a chat message

5. **Verify Real-time Sync**
   - Keep both browsers open
   - Do activity as Tedi
   - Should update in Airin's view immediately
   - Try chat - messages should appear instantly

---

## Step 4: Final Checks

### ✅ Database Checklist
- [ ] `tedi-airin-schema.sql` executed successfully
- [ ] 7 tables created
- [ ] 2 players exist (Tedi, Airin)
- [ ] Relationship stats initialized
- [ ] RLS policies enabled

### ✅ Functionality Checklist
- [ ] Can choose Tedi or Airin
- [ ] Status bars show correctly
- [ ] Can do activities
- [ ] Stats update after activity
- [ ] Partner status visible
- [ ] Can send care actions
- [ ] Can send chat messages
- [ ] Real-time sync works
- [ ] Intimacy points increase
- [ ] Mobile responsive

### ✅ Production Checklist
- [ ] Build successful (no errors)
- [ ] Environment variables set on Vercel
- [ ] Supabase Realtime enabled
- [ ] Tables have RLS policies
- [ ] Performance acceptable
- [ ] Mobile UI works

---

## 🔧 If Something Goes Wrong

### Database Issues
```sql
-- If need to reset, run this first:
DROP TABLE IF EXISTS life_players CASCADE;
DROP TABLE IF EXISTS life_activities CASCADE;
DROP TABLE IF EXISTS care_actions CASCADE;
DROP TABLE IF EXISTS life_messages CASCADE;
DROP TABLE IF EXISTS life_reminders CASCADE;
DROP TABLE IF EXISTS relationship_stats CASCADE;
DROP TABLE IF EXISTS memory_lane CASCADE;

-- Then run tedi-airin-schema.sql again
```

### Build Issues
```bash
# Test build locally first
npm run build

# If errors, fix TypeScript issues
# Then commit and push again
```

### Vercel Issues
- Check Environment Variables in Vercel dashboard
- Make sure they match `.env.local`
- Redeploy if needed

### Real-time Not Working
1. Go to Supabase Dashboard
2. Database → Replication
3. Make sure publication includes all life_* tables
4. Restart Realtime if needed

---

## 📞 Quick Reference

### URLs
- **Production**: https://jarak-jadi-dekat.vercel.app
- **Game**: https://jarak-jadi-dekat.vercel.app/life
- **Supabase**: https://supabase.com/dashboard
- **Vercel**: https://vercel.com/dashboard
- **GitHub**: https://github.com/jafarsmi012-ux/jarak-jadi-dekat

### Files
- **Schema**: `tedi-airin-schema.sql`
- **Types**: `src/types/life.ts`
- **API**: `src/lib/lifeApi.ts`
- **Main Page**: `src/app/life/page.tsx`
- **Components**: `src/components/life/*.tsx`
- **Guide**: `LIVING-TOGETHER-GUIDE.md`

### Commands
```bash
# Local development
npm run dev

# Build
npm run build

# Git
git status
git add .
git commit -m "message"
git push origin main
```

---

## 🎉 SUCCESS CRITERIA

You'll know it's working when:

1. ✅ Both Tedi and Airin can login
2. ✅ Status bars show and update
3. ✅ Activities can be performed
4. ✅ Partner's status shows on right
5. ✅ Care actions can be sent and received
6. ✅ Chat messages work in real-time
7. ✅ Intimacy level increases
8. ✅ Everything works on mobile

---

## 💝 Ready to Play!

Once all steps complete:

1. Share URL with Tedi & Airin
2. Each person chooses their character
3. Start your virtual life together!

**Remember**: This game is only for Tedi (Bandung) and Airin (Padang). It's hardcoded just for you two! 💕

---

*"Selamat tinggal bareng secara virtual!"* 🏠❤️
