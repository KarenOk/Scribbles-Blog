import React from "react";
import Rodal from "rodal";

function ConfirmDelete({ visible, close, deleteInfo }) {
	const onConfirm = () => {
		if (deleteInfo) deleteInfo.onConfirm();
		close();
	};
	return (
		<Rodal
			animation="rotate"
			visible={visible}
			className="confirm-delete"
			onClose={() => close()}
			height={260}
			width={null}
		>
			<div className="body">
				<span> &#x02205;</span>
				<h2> Delete this {deleteInfo && deleteInfo.type} ? </h2>
				<p> This action cannot be undone.</p>
				<div className="actions">
					<button className="yes" onClick={onConfirm}>
						Yes
					</button>
					<button className="no" onClick={close}>
						No
					</button>
				</div>
			</div>
		</Rodal>
	);
}

export default ConfirmDelete;
