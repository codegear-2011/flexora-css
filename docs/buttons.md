# Buttons

Flexora buttons are designed for high-conversion interfaces.

```html
<button class="fx-btn">Click Me</button>
```
### 3. Critical Setup Rules:
1.  **Running Locally:** You **cannot** just double-click the `index.html` file (the browser will block the "fetch" of markdown files). You must use a local server (VS Code **Live Server**, Python's `http.server`, or Node's `serve`).
2.  **Admonitions:** I added a special feature for you. If you write `::: note ... :::` in your markdown, it will turn into the blue "Note" box used by Read the Docs.
3.  **Expansion:** To add a new page, simply create the `.md` file and add one `<a>` tag to the `<nav id="sidebar-nav">` in the `index.html`. It will handle the rest!
