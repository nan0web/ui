export { default as InputAdapter } from './InputAdapter.js'
export { default as OutputAdapter } from './OutputAdapter.js'

import UIStream from './Stream.js'
export { UIStream, UIStream as UiStream }
import StreamEntry from './StreamEntry.js'
export { StreamEntry, StreamEntry as UiStreamEntry }

export { default as UiMessage } from './Message/Message.js'
export { default as FormMessage } from './Form/Message.js'
export { default as FormInput } from './Form/Input.js'

import UIForm from './Form/Form.js'
export { UIForm, UIForm as UiForm }

export { default as Error, CancelError } from './Error/index.js'

export { default as UiAdapter } from './UiAdapter.js'

// Flow — Yield-Based Universal UI Architecture
export {
	runFlow,
	flow,
	View,
	Prompt,
	Stream,
	Alert,
	Toast,
	Badge,
	Text,
	Table,
	Input,
	Select,
	Confirm,
	Multiselect,
	Mask,
	Password,
	Spinner,
	Progress,
} from './Flow.js'
export { default as Flow } from './Flow.js'
