# English Idioms Quiz — English with Vivien

An offline classroom presentation app for adult English learners. No account, subscription, internet connection, or installation is required.

## Open it on Windows

1. Download this repository (on GitHub: **Code → Download ZIP**).
2. Right-click the ZIP file and choose **Extract All**.
3. Open the extracted folder. Keep `index.html`, `styles.css`, `starter-data.js`, `more-topics.js`, `lesson-support.js`, and `app.js` together, along with the complete `assets` folder.
4. **Double-click `index.html`.** It opens in your default browser. Microsoft Edge or Google Chrome is recommended. If needed, right-click it → **Open with → Microsoft Edge**.

You do not need a terminal or any commands. On tablets, use a browser that supports opening local HTML files; alternatively, serve this folder using any ordinary static web server.

## Present a lesson

- Topics appear as compact, numbered horizontal menu rows, with equal-height Start Quiz buttons aligned on the right. The rows adapt to phones without stacking the buttons below the titles. Everyday Life is set 1, Workplace Idioms is set 2, and Competition & Winning is set 3. The header and footer use the approved **English with Vivien** handwritten V and speech-bubble logo. The same symbol is the browser tab icon, with a mint-and-cream interface. Header typography requests Didot Italic for “English with Vivien” and Didot Roman for “English Idioms Quiz.” It uses locally installed fonts; if Didot is unavailable, Bodoni MT, Georgia, or the browser’s serif font is used. Didot font files are not bundled, so identical Didot rendering across devices requires a separately supplied webfont suitable for the site.
- On Home, choose **Start Quiz** for a topic. Turn on **Shuffle questions when starting a quiz** first for a random question order. Answer choices keep their A–D order.
- Shuffling applies only to that quiz session; it never changes the saved editor order. Previous/Next follow the chosen order, and Restart keeps it. Return Home and start again to reshuffle or turn shuffle off for the original order.
- Each question shows one small landscape picture clue based on an example situation. It is an original vector illustration, not a literal drawing of the idiom. Review questions for the same expression share its clue.
- Read the question and discuss the four answers. Click any answer to check it: correct choices turn green and show “Correct”; incorrect choices turn red and show “Incorrect. Try another answer.” You can try another choice. No scores are recorded. Answer choices also work with Tab followed by Enter or Space.
- Select **Reveal Answer** to highlight the correct answer and show its definition, Korean meaning, and two English examples, each starting with **e.g.** on its own line (no bullets). **Hide Answer** conceals them again.
- After revealing, **Let’s talk about it** provides three discussion questions for the expression: personal experience, a practical speaking situation, and an opinion. Invite learners to use the target expression in each answer. Learners may invent an example instead of sharing private experiences. Hide Answer hides the discussion too.
- Use **Previous** and **Next Question**. Moving between questions always clears the selected answer and hides the explanation again. Hide Answer also clears the selection for a fresh discussion.
- The final question has **Finish Quiz**, followed by an end screen where you can revisit the last question, restart, or return home.
- **Restart quiz** asks for confirmation.
- Use **Fullscreen** for presenting. Press **Esc** to exit (or F11 on Windows if browser fullscreen is unavailable).
- Keyboard: **← / →** move between questions; **Space** reveals/hides the answer; **F** toggles fullscreen. Shortcuts pause when typing or editing. Space activates a focused button normally; click the question background to use Space for reveal again.

## Edit questions without coding

1. Select **Question editor** in the top navigation.
2. Choose a topic. Select **Edit** beside a question, or **Add question**.
3. Enter a question, four different answers, the correct answer letter, idiom, English definition, Korean meaning, and two English examples. The app automatically adds “e.g.” when displaying each example; you can enter it with or without that prefix.
4. Under **Picture clue & discussion**, choose one of the 87 built-in pictures that matches an example situation, and edit the three discussion prompts. Existing expressions come with tailored prompts; new custom expressions start with editable general prompts.
5. Select **Save question**. Changes are saved locally in this browser.
6. Use **Add topic** to create a new topic, then add its questions. Empty topics cannot start a quiz.
7. **Delete** asks for confirmation before removing a question.

Twelve starter topics contain 10 questions each (120 questions total): Competition & Winning; Workplace Idioms; Everyday Life; Money & Shopping; Feelings & Reactions; Friends & Relationships; Communication & Conversation; Time & Busy Lives; Decisions & Plans; Challenges & Resilience; Health, Energy & Rest; and Learning & Improving.

The ten additional topics each introduce seven common expressions, with seven situation questions and three meaning-review questions. Every expression includes a simple definition, Korean meaning, and two original example sentences based on realistic everyday situations. Some expressions are especially informal; they are suited to conversation rather than every formal document.

Older questions and imports without picture/discussion fields receive matching defaults by expression; existing custom picture selections and discussion prompts are preserved. All existing question text, answers, explanations, and examples remain editable. Imports with a picture must use a built-in clue ID, and supplied discussion lists must contain exactly three nonempty questions. Picture selections and discussion prompts travel with JSON backups. For custom examples, review the picture match in the editor.

When the app updates, existing browser saves receive missing topics from the new content release once, without replacing edited questions. Topics already using the same ID or name are preserved. Topics from older releases are not restored during later upgrades. At the 100-topic limit, a message explains why some topics could not be added. Imports deliberately replace the content exactly as supplied, and are not supplemented on the next reload. Teachers should review new questions to ensure only the selected answer is correct; the editor can check structure but cannot judge language accuracy.

## Back up and transfer your questions

- In Question editor, select **Export JSON** to download all topics and questions. Keep a backup after editing.
- On another computer, open the app, select Question editor → **Import JSON**, and choose your exported file.
- Import **replaces all topics and questions**, after confirmation. Export first if you need to preserve the current quiz.
- Invalid files produce a message without changing your quiz. Imports are limited to 5 MB, 100 topics, and 500 questions per topic. The version 1 format is demonstrated by exported files; `correct` uses 0–3 for A–D.

Local saves belong to your browser and file location, not to the source files. They do not sync. Moving/renaming the folder, switching browsers, private browsing, clearing browser data, or browser restrictions on local file storage may hide or remove them. **Export JSON is the reliable backup.** A storage error is shown when a change cannot be saved; the app does not pretend that it saved. If existing stored data cannot be read, starter content is shown without overwriting it. Keep your backup and try importing in a regular browser window with storage allowed.

## Project files

- `index.html`: home, classroom screen, editor, and question form.
- `styles.css`: responsive mint-and-cream design with dark readable text.
- `starter-data.js`: the first 20 questions across two topics, with bilingual explanations.
- `more-topics.js`: ten more topics with 100 questions and bilingual explanations.
- `lesson-support.js`: picture mappings and 261 tailored discussion prompts for 87 expressions.
- `assets/brand/`: the mint symbol and full approved logo; keep these with the project when running offline.
- `assets/clues/`: 87 compact, self-contained SVG illustrations. These work offline and do not make requests to image services.
- `app.js`: quiz controls, editing, localStorage, validation, and JSON transfer.
- `README.md`: these instructions.

No build step or third-party runtime dependencies. Regular scripts (rather than modules or fetch) allow direct `file://` opening. No external fonts, images, APIs, or services are used.

For cloud development only, an optional static server is `python3 -m http.server 8000 --bind 127.0.0.1` from the project folder. The app itself does not require Python or a server.
