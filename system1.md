# System Instructions for NaN•UI

## Overview
NaN•UI is a Vanilla JavaScript UI framework designed to be platform-agnostic, working seamlessly in Node.js, browsers, and other environments that support ESM. The framework emphasizes minimal dependencies, clean class structures, and comprehensive testing with Vitest.

## Requirements

### JavaScript
1. **Pure Vanilla JS**: Only use vanilla JavaScript without platform-specific dependencies.
2. **Platform Abstraction**: Ensure the code works across different platforms.
3. **Minimal Dependencies**: Keep dependencies to a minimum.
4. **Class Structure**:
   - **Order of Class Elements**:
     - Static properties
     - Properties
     - Constructor
     - Getters
     - Setters
     - Base functions
     - Async functions
     - Static base functions
     - Static async functions
5. **Views**:
   - Each view must have a separate file and test file (`View/AppView.js` and `View/AppView.test.js`).
6. **Components**:
   - Each component must have a separate directory in `View/Component/*` or be registered from another directory with the following files:
     - `Component.js`
     - `Component.test.js`
     - `ComponentInput.js`
     - `index.js` (exporting the component and its input class).

### Vitest
- All tests must run with Vitest.
- Every model, component, and class must have its own test file to cover functionality in an isolated environment.

## Interfaces

### Views
- **Widgets**: Control elements that include a view and the ability to input data.
- **Output**: Data passed to the view in a specific format.
- **Input**: Data required by the application, which can be provided via command line or user input.

### Cross-Platform
- Extend basic UI with different apps (e.g., CLI, web).
- **Core Application**: Minimal stdin/stdout implementation.
- **CLI Application**: Utilizes libraries like `blessed` for rich CLI UI.
- **Web Application**: Utilizes libraries like `lit` for rich web UI.

## Code Structure

### Core Application
- **`src/App/Command/Args.js`**: Handles command arguments.
- **`src/App/Command/Message.js`**: Parses and processes command messages.
- **`src/App/Command/Options.js`**: Manages command options.
- **`src/App/Core/CCoreApp.js`**: Abstract base class for all apps.
- **`src/App/Core/UI.js`**: Abstract UI class to connect apps and widgets.
- **`src/App/Core/Widget.js`**: Abstract widget class with input/output capabilities.

### User Application
- **`src/App/User/UserApp.js`**: User-specific application logic.
- **`src/App/User/UserUI.js`**: Connects UserApp and View.

### Components
- **`src/Component/Process/Process.js`**: Process component with input handling.
- **`src/Component/Welcome/Welcome.js`**: Welcome component with user input handling.

### Views
- **`src/View/View.js`**: Main view class with rendering and input/output capabilities.

### Models
- **`src/Model/User/User.js`**: User model class.

### Utilities
- **`src/Frame/Frame.js`**: Handles frame rendering and formatting.
- **`src/InputMessage.js`**: Manages input messages.
- **`src/Locale.js`**: Handles localization and formatting.
- **`src/StdIn.js`**: Manages standard input.
- **`src/StdOut.js`**: Manages standard output.

## Testing
- **Vitest**: All tests are written using Vitest.
- **Test Files**: Each component, model, and class has a corresponding test file (e.g., `Component.test.js`, `Model.test.js`).

## Apps
- **CLI App**: Located in `apps/cli/src/`, handles command-line interface.
- **Web App**: Located in `apps/web/src/`, handles web interface.

## Example Usage

### CLI App
```javascript
import process from "node:process"
import { App, View, StdIn, StdOut, Frame, Component } from "@nan0web/ui"

async function main(argv) {
    const app = new App.User.App({ argv })
    const view = new View({
        stdin: new StdIn({ processor: process.stdin }),
        stdout: new StdOut({ processor: process.stdout }),
        renderMethod: Frame.RenderMethod.VISIBLE,
    })
    view.register(Component.Welcome)

    const ui = new App.User.UI(app, view)
    await ui.process(argv)
}

main(process.argv.slice(2)).then(() => {
    process.exit(0)
}).catch(err => {
    console.error("Error:", err)
    process.exit(1)
})
```

### Web App
```javascript
import React from "react"
import UserDocumentsInput from "src/components/User/DocumentsInput.js"

function UserDocumentsView(input = {}) {
    input = UserDocumentsInput.from(input)
    if (empty(input)) {
        throw new Error("Input data required in a format off UserDocumentsInput")
    }

    return <div>
        <h3>Documents</h3>
        <ul>
            {input.documents.map((d, i) => <li key={i}>{d.name}</li>)}
        </ul>
    </div>
}
```

## Conclusion
NaN•UI provides a robust, platform-agnostic framework for building UIs with minimal dependencies. The code is structured to ensure clarity, maintainability, and comprehensive test coverage. By following the outlined requirements and structure, developers can build scalable and maintainable UI components and applications.
