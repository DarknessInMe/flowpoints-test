const validateDrop = (prev: number, current: number): boolean => {
	const pseudoCurrent: number = prev + 1;

	return pseudoCurrent === current;
};

export default validateDrop;
