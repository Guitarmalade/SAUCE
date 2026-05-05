# Cheat Sheet — How to do everything

This is a no-shame, copy-paste-ready reference. If you forget anything, this file has the answer. Live at `~/sauce/CHEATSHEET.md`.

The Terminal app on your Mac is what we mean by "terminal." Open it from Spotlight (Cmd + Space, type "terminal").

---

## 1. View the mockup in a browser

The mockup uses React, which means it needs to be served by a tiny local web server. Opening the files by double-clicking will only show a black screen.

**Start the server:**

```
cd ~/sauce
python3 -m http.server 8000
```

You'll see something like `Serving HTTP on :: port 8000 ...`. Leave that terminal window alone — closing it stops the server.

**Then visit in your browser:**

- Mockup file list: http://localhost:8000/references/guitarmalade-sauce-pack/
- Current editable home: http://localhost:8000/references/guitarmalade-sauce-pack/editable-home.html
- Current editable dashboard: http://localhost:8000/references/guitarmalade-sauce-pack/editable-dashboard.html
- Current editable practice: http://localhost:8000/references/guitarmalade-sauce-pack/editable-practice.html
- Original v1 (black + orange): http://localhost:8000/references/guitarmalade-sauce-pack/Guitarmalade%20SAUCE%20App%20v1.html
- Original v2 (black + orange, more polished): http://localhost:8000/references/guitarmalade-sauce-pack/Guitarmalade%20SAUCE%20App%20v2.html

**Stop the server when done:**

Click into the terminal window where the server is running and press **Ctrl + C**.

---

## 2. Save your work to git and GitHub (the daily ritual)

Do this whenever you finish a chunk of work. Three commands.

**If the server is running:** open a new terminal window first (`Cmd + N` in the Terminal app), or stop the server with `Ctrl + C`. You can't run git in the same window where the server is running.

```
cd ~/sauce
git add .
git commit -m "what you did"
git push
```

Replace `what you did` with a short real description. Examples:

- `"updated home page copy"`
- `"changed accent color to orange"`
- `"added session notes"`

After `git push`, your work is backed up at https://github.com/Guitarmalade/SAUCE.

**Compressed two-command version (only works for files git already knows about — not new files you created):**

```
git commit -am "what you did"
git push
```

---

## 3. See what changed (and roll back if needed)

**See your save history:**

```
cd ~/sauce
git log --oneline
```

You'll see a list of commits. Each one is a save point. The top is the most recent.

**See what's changed since the last save:**

```
git status
```

If it says "nothing to commit, working tree clean," you're up to date. Otherwise, it lists the files that have been edited or added since the last commit.

**Throw away unsaved changes (DANGEROUS — only if you're sure you want to undo):**

```
git checkout .
```

This wipes any edits you've made since the last commit. Use it when you've made a mess and want to start fresh from your last save.

**Roll back to an earlier save (also dangerous, ask AI for help if unsure):**

This needs the commit hash from `git log --oneline`. Don't memorize this — just look it up when you need it.

---

## 4. Resume a Codex terminal session

```
codex resume          # pick from a list of past sessions
codex resume --last   # jump straight back into the most recent one
```

---

## 5. Where things live

```
Project root:                ~/sauce
Project on GitHub:            https://github.com/Guitarmalade/SAUCE
Editable mockup folder:       ~/sauce/references/guitarmalade-sauce-pack/
Editing instructions:         ~/sauce/references/guitarmalade-sauce-pack/EDITING.md
AI agent guide:               ~/sauce/AGENTS.md
Session notes:                ~/sauce/NOTES.md
This cheat sheet:             ~/sauce/CHEATSHEET.md
Real app code (not mockup):   ~/sauce/apps/web/  and  ~/sauce/apps/api/
Project docs:                 ~/sauce/docs/
```

**Files in the mockup you actually edit:**

- `editable-home.html` — home screen layout & copy
- `editable-dashboard.html` — dashboard layout & copy
- `editable-practice.html` — practice screen layout & copy
- `editable-mockup.css` — colors, spacing, typography, borders
- `editable-ui.js` — interactive behavior (rarely needs editing)

**Files in the mockup you do NOT edit (keep for reference):**

- `Guitarmalade SAUCE App.html` and `v2.html` — original Claude exports
- `*.jsx` files — React components used by the originals

---

## 6. Common situations and what to do

**"I closed the terminal and now nothing works."**
Open a new Terminal window. Everything will be fine. None of your files were lost. Just run the start-the-server command again if you need to view the mockup.

**"I ran a git command in the wrong terminal window and it didn't work."**
The server's terminal window can't run other commands while it's serving. Either open a new terminal window or press `Ctrl + C` in the server window to stop the server first.

**"`git push` failed with a 'secret scanning' message."**
GitHub thinks one of your files contains a real API key. If it's a placeholder or test key (all X's, or labeled `_test_`), click the URL it gives you, choose "used in tests," and allow it. Then run `git push` again.

**"`git commit` failed and said something about identity."**
Tell git who you are (one-time setup, but if you switch machines you'll need it again):

```
git config --global user.email "schreiner.chris@gmail.com"
git config --global user.name "Christopher Schreiner"
```

**"I see a black screen in the browser when I open the mockup files."**
You opened them via double-click (a `file://` URL). Browsers block local React files for security. Use the local server method (Section 1) instead.

**"`git status` shows files I never edited as 'untracked' or 'modified'."**
That's fine — it just means you have new or changed files git hasn't saved yet. To save them, do the daily ritual (Section 2).

**"I forgot to commit before closing my laptop / restarting / etc."**
Your files aren't lost. Open the project tomorrow and your edits will still be there. They just don't have a save point yet — make one as soon as you're back.

**"How do I know git and GitHub are working?"**
Visit https://github.com/Guitarmalade/SAUCE in a browser. If you see your files, GitHub is working. Run `git log --oneline` in the project — if you see commits, git is working.

---

## 7. The mental model in one paragraph

Your project lives in `~/sauce`. Git keeps a history of every save point on your computer. GitHub keeps a copy of the same history in the cloud. The mockup is HTML/CSS/JSX files that need a tiny local server to render properly. AI tools (Claude, Codex) read your project's `AGENTS.md` and `NOTES.md` to understand context. Save your work often using the three-command ritual. Don't be scared to delete things — git remembers everything that's been committed, so you can always roll back.

---

## 8. When in doubt

- Ask Claude (here) or Codex (in the terminal) — paste the command you ran and any error you got.
- If a command says it failed, **read the error message** before retrying. Often the fix is right there in the message.
- If you're about to do something destructive (delete files, force-push, etc.), commit first. The commit takes 5 seconds and saves you from yourself.
