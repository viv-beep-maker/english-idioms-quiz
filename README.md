# English Idioms Quiz — Teacher Edition

An offline classroom presentation app for adult English learners. No account, subscription, internet connection, or installation is required.

## Open it on Windows

1. Download this repository (on GitHub: **Code → Download ZIP**).
2. Right-click the ZIP file and choose **Extract All**.
3. Open the extracted folder. Keep `index.html`, `styles.css`, `starter-data.js`, and `app.js` together.
4. **Double-click `index.html`.** It opens in your default browser. Microsoft Edge or Google Chrome is recommended. If needed, right-click it → **Open with → Microsoft Edge**.

You do not need a terminal or any commands. On tablets, use a browser that supports opening local HTML files; alternatively, serve this folder using any ordinary static web server.

## Present a lesson

- On Home, choose **Start Quiz** for a topic.
- Read the question and discuss the four answers. Clicking an answer does not reveal anything or record a score.
- Select **Reveal Answer** to highlight the correct answer and show its definition, Korean meaning, and two English examples. **Hide Answer** conceals them again.
- Use **Previous** and **Next Question**. Moving between questions always hides the answer again.
- The final question has **Finish Quiz**, followed by an end screen where you can revisit the last question, restart, or return home.
- **Restart quiz** asks for confirmation.
- Use **Fullscreen** for presenting. Press **Esc** to exit (or F11 on Windows if browser fullscreen is unavailable).
- Keyboard: **← / →** move between questions; **Space** reveals/hides the answer; **F** toggles fullscreen. Shortcuts pause when typing or editing. Space activates a focused button normally; click the question background to use Space for reveal again.

## Edit questions without coding

1. Select **Question editor** in the top navigation.
2. Choose a topic. Select **Edit** beside a question, or **Add question**.
3. Enter a question, four different answers, the correct answer letter, idiom, English definition, Korean meaning, and two English examples.
4. Select **Save question**. Changes are saved locally in this browser.
5. Use **Add topic** to create a new topic, then add its questions. Empty topics cannot start a quiz.
6. **Delete** asks for confirmation before removing a question.

The starter topic contains 10 questions covering seven idioms, with meaning, context, and usage questions. Teachers should review new questions to ensure only the selected answer is correct; the editor can check structure but cannot judge language accuracy.

## Back up and transfer your questions

- In Question editor, select **Export JSON** to download all topics and questions. Keep a backup after editing.
- On another computer, open the app, select Question editor → **Import JSON**, and choose your exported file.
- Import **replaces all topics and questions**, after confirmation. Export first if you need to preserve the current quiz.
- Invalid files produce a message without changing your quiz. Imports are limited to 5 MB, 100 topics, and 500 questions per topic. The version 1 format is demonstrated by exported files; `correct` uses 0–3 for A–D.

Local saves belong to your browser and file location, not to the source files. They do not sync. Moving/renaming the folder, switching browsers, private browsing, clearing browser data, or browser restrictions on local file storage may hide or remove them. **Export JSON is the reliable backup.** A storage error is shown when a change cannot be saved; the app does not pretend that it saved. If existing stored data cannot be read, starter content is shown without overwriting it. Keep your backup and try importing in a regular browser window with storage allowed.

## Project files

- `index.html`: home, classroom screen, editor, and question form.
- `styles.css`: responsive lavender, cream, and navy design.
- `starter-data.js`: the original 10 questions and bilingual explanations.
- `app.js`: quiz controls, editing, localStorage, validation, and JSON transfer.
- `README.md`: these instructions.

No build step or third-party runtime dependencies. Regular scripts (rather than modules or fetch) allow direct `file://` opening. No external fonts, images, APIs, or services are used.

For cloud development only, an optional static server is `python3 -m http.server 8000 --bind 127.0.0.1` from the project folder. The app itself does not require Python or a server.
