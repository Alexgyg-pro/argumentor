# Current README.md file structure

docs/
├── Diagramme UI.drawio
├── filestructure.md
└── rules.md
public/
└── samples/
│ ├── lune1969.json
│ └── mars2031.json
src/
├── assets/
│ ├── react.svg
├── components/
│ ├── arguments/
| │ ├── ArgumentTree.jsx # components ArgumentTree and ArgumentNode
│ ├── common/
| │ ├── HiddenFileInput.jsx
| │ ├── Icon.jsx
| │ ├── Icons.jsx
│ ├── definitions/
| │ ├── DefinitionsList.jsx
│ ├── forms/
| │ ├── ArgumentaireForm.jsx
| │ ├── ArgumentForm.jsx
| │ ├── DefinitionForm.jsx
| │ ├── Forms.jsx
| │ ├── Forms.module.css
| │ ├── ReferenceForm.jsx
| │ ├── ReferenceSelector.jsx
│ ├── help/
| │ ├── contents/
| | │ ├── instructions.js
| | │ ├── theory.js
| | │ ├── welcome.js
| │ ├── HelpModal.jsx
| │ ├── HelpModal.module.css
│ ├── layout/
| │ ├── Footer.jsx
| │ ├── Header.jsx
| │ ├── Header.module.css
| │ ├── Menu.jsx
| │ ├── Menu.module.css
│ ├── modals/
| │ ├── ArgumentaireModal.jsx
| │ ├── ArgumentModal.jsx
| │ ├── DefinitionModal.jsx
| │ ├── Modal.jsx
| │ ├── Modal.module.css
| │ ├── ReferenceModal.jsx
| │ ├── ReferencePreviewModal.jsx
│ ├── references/
| │ ├── ReferenceList.jsx
│ ├── screens/ # Main view components
| │ ├── DisplayScreen.jsx
| │ ├── DisplayScreen.module.css
| │ ├── StartScreen.jsx
| │ ├── StartScreen.module.css
├── hooks/
│ ├── useArgumentaire.js # Global app state orchestration
│ ├── useArguments.js
│ ├── useDefinitions.js
│ ├── useReferences.js
├── styles/
│ ├── utilities.css
├── utils/
│ ├── argumentUtils.js
│ ├── confirm.js
│ ├── definitionUtils.js
│ ├── idUtils.js
│ ├── referenceUtils.js
└── App.css
└── App.jsx
└── App.module.css
└── index.css
└── main.jsx
.eslintrc.cjs
.gitignore
eslint.config.js
index.html
package-lock.json
package.json
README.md
vite.config.js
