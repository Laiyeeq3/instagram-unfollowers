(async () => {
    console.log("🚀 Fetching Instagram Unfollowers...");

    // Function to fetch data from Instagram GraphQL API
    async function fetchData(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    // Function to extract user ID from cookies
    function getUserId() {
        return document.cookie.split('; ')
            .find(row => row.startsWith('ds_user_id='))
            ?.split('=')[1];
    }

    const userId = getUserId();
    if (!userId) {
        console.error("❌ Error: Unable to get User ID. Make sure you're logged into Instagram.");
        return;
    }

    // URLs for fetching followers and following lists
    const followersUrl = `https://www.instagram.com/graphql/query/?query_hash=5aefa9893005572d237da5068082d8d5&variables={"id":"${userId}","include_reel":true,"fetch_mutual":false,"first":50}`;
    const followingUrl = `https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables={"id":"${userId}","include_reel":true,"fetch_mutual":false,"first":50}`;

    try {
        console.log("🔄 Fetching followers...");
        const followersData = await fetchData(followersUrl);
        const followers = followersData.data.user.edge_followed_by.edges.map(edge => edge.node.username);

        console.log("🔄 Fetching following...");
        const followingData = await fetchData(followingUrl);
        const following = followingData.data.user.edge_follow.edges.map(edge => edge.node.username);

        // Find unfollowers (users you follow who don't follow you back)
        const unfollowers = following.filter(user => !followers.includes(user));

        console.log(`📢 You have ${unfollowers.length} unfollowers:`);
        console.table(unfollowers);
    } catch (error) {
        console.error("⚠️ Error fetching data:", error);
    }
})();
