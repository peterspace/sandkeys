import React from "react";
import { IoIosClose } from "react-icons/io";

export default function Modal({
	visible,
	setVisible,
	hideTitle = false,
    hideBackground=false,
	title,
    children
}) {
	if (!visible) return null;

	// To prevent event bubbling
	function handleOnClose(e) {
		if (e.target.id === "parent") setVisible(false);
	}

	return (
		<div
			id="parent"
			className="fixed inset-0 backdrop-filter backdrop-blur-md bg-black bg-opacity-50
                flex justify-center items-center overflow-auto z-50"
			onClick={(e) => {
				handleOnClose(e);
			}}
		>
			{/* <section className={`relative max-h-[500px] h-fit px-5 py-4 flex flex-col rounded-lg overflow-scroll ${hideBackground? '':'bg-gray-100'}`}></section> */}
			{/* <section className={`relative max-h-[500px] h-fit px-5 py-4 flex flex-col rounded-lg overflow-scroll ${hideBackground? '':'notification-light-gradient'}`}></section> */}
			<section className={`relative h-fit px-5 py-4 flex flex-col rounded-lg overflow-hidden ${hideBackground? '':'bg-gray-50'}`}>
				{hideTitle ? null : (
					<span className="mb-3 flex flex-row justify-between  text-2xl text-white">
						{title && <h3 className="font-helvetica text-black">{title}</h3>}
						<span
							onClick={() => {
								setVisible(false);
							}}
							className="cursor-pointer"
						>
							<IoIosClose />
						</span>
					</span>
				)}
				<div>{children}</div>
			</section>
		</div>
	);
}
