import React, {useState, useEffect} from "react";

const Countdown = ({endTime}) => {
	const [endDays, setEndDays] = useState(0);
	const [endHours, setEndHours] = useState(0);
	const [endMinutes, setEndMinutes] = useState(0);
    const [endSeconds, setEndSeconds] = useState(0);

	function getCountdown() {
		const endDate = new Date(endTime * 1000);
		const now = Date.now();
        let duration = endDate - now;
        
		if (duration < 0) return;

		let days = Math.floor(duration / (1000 * 60 * 60 * 24));
		let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
		let minutes = Math.floor((duration / 1000 / 60) % 60);
		let seconds = Math.floor((duration / 1000) % 60);

		setEndDays(days);
		setEndHours(hours);
		setEndMinutes(minutes);
		setEndSeconds(seconds);
	}

	useEffect(() => {
		// const now = new Date().getTime()/1000.0;
		const now = Date.now() / 1000.0;
		let duration = endTime - now;

		if (duration > 0) {
			const interval = setInterval(() => {
				getCountdown();
			}, 1000);

			return () => clearInterval(interval);
        } else {
			setEndDays("-");
			setEndHours("-");
			setEndMinutes("-");
			setEndSeconds("-");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [endTime]);

	return (
		<div className="px-2 flex flex-row gap-2 w-full text-xs text-white rounded-lg">
			<div className="mx-auto flex flex-row gap-1">
				<span>{endDays}</span>
				<span>d</span>
				{/* <div className="flex flex-row gap-1"> */}
					<span>{endHours}</span>
					<span>h</span>
				{/* </div> */}
			</div>
			<div className="mx-auto flex flex-row gap-2 w-full">
				<div className="flex flex-row gap-1">
					<span>{endMinutes}</span>
					<span>m</span>
				</div>
				<div className="flex flex-row gap-1">
					<span>{endSeconds}</span>
					<span>s</span>
				</div>
			</div>
		</div>
	);
};

export default Countdown;
