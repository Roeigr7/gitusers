import { useState, useCallback, useRef } from "react";
import "./App.css";
import useUsersSearch from "./helpers/useUsersSearch";
function App() {
	const [nameQuery, setNameQuery] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	const observer = useRef();
	const { users, hasMore, loading, totalResult } = useUsersSearch(nameQuery, pageNumber);

	const lastUserRef = useCallback(
		///check the last item in the screen and go next page if he is///
		node => {
			if (loading) return;
			if (observer.current) observer.current.disconnect();
			observer.current = new IntersectionObserver(entries => {
				if (entries[0].isIntersecting && hasMore) {
					setPageNumber(prevPageNumber => prevPageNumber + 1);
				}
			});
			if (node) observer.current.observe(node);
		},
		[loading, hasMore]
	);
	//handle the user input entering//
	const handleSearch = e => {
		setNameQuery(e.target.value);
		setPageNumber(1);
	};
	return (
		<div className="container">
			<h1 className="title">Welcome to Infinite github Users Search</h1>
			<p className="copyright">&#169; Roei Grinshpan</p>
			<input
				placeholder="Enter username"
				className="input-field"
				value={nameQuery}
				type="text"
				onChange={handleSearch}
			/>

			<h2>{totalResult ? `${totalResult} Users Found` : "search for username"} </h2>
			<div className="container-items">
				{users.map((user, i) => {
					if (users.length === i + 1) {
						return (
							<div className={i % 2 === 0 ? "item" : "item odd"} ref={lastUserRef} key={i}>
								<div className="loginname">{user.login}</div>
								<img alt="avatar" className="avatar" src={user.avatar_url} />
								<div className="userid">{user.id}</div>
								<div className="userpage">{user.html_url}</div>
							</div>
						);
					} else {
						return (
							<div className={i % 2 === 0 ? "item" : "item odd"} key={i}>
								<div className="loginname">{user.login}</div>
								<img alt="avatar" className="avatar" src={user.avatar_url} />
								<div className="userid">{user.id}</div>
								<div className={i % 2 === 0 ? "userpage" : "userpageodd"}>{user.html_url}</div>
							</div>
						);
					}
				})}
			</div>
			<div>{loading && "loading..."}</div>
		</div>
	);
}

export default App;
