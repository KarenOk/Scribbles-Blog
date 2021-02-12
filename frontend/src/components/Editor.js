import React from "react";
import CKEditor from "ckeditor4-react";

function Editor({ content, setContent }) {
	const onEditorChange = (e) => {
		setContent(e.editor.getData());
	};

	return (
		<div className="editor">
			<CKEditor data={content} onChange={onEditorChange} />
		</div>
	);
}

export default Editor;
