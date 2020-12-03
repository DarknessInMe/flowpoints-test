const unique = (function () {
	let cntr = 0;
	return function (prefix?: string) {
		prefix = prefix || "";
		return prefix + cntr++;
	};
})();

export default unique;
