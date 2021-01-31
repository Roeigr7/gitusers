import { useEffect, useState } from "react";
import axios from "axios";
export default function useUsersSearch(nameQuery, pageNumber) {
	const [loading, setLoading] = useState(false);

	const [users, setUsers] = useState([]);
	const [hasMore, setHasMore] = useState(false);
	const [totalResult, setTotalResult] = useState(false);
	useEffect(() => {
		setUsers([]);
	}, [nameQuery]);

	useEffect(() => {
		setLoading(true);
		let cancel;
		///api call to get all the users name with pagination
		axios({
			method: "get",
			url: `https://api.github.com/search/users?q=${nameQuery}+in:user&per_page=30&page=${pageNumber}`,
			cancelToken: new axios.CancelToken(c => (cancel = c)),
			headers: {
				Accept: "application/vnd.github.v3+json",
			},
		})
			.then(result => {
				//set all the states, set new pageination and add to the older array//
				const results = result.data.items;
				setTotalResult(result.data.total_count);
				setHasMore(result.data.total_count > 0);
				setUsers(prevUsers => {
					return [...prevUsers, ...results];
				});
			})
			.catch(e => {
				if (axios.isCancel(e)) return;
			});

		setLoading(false);
		return () => cancel();
	}, [nameQuery, pageNumber]);

	return { loading, users, hasMore, totalResult };
}
