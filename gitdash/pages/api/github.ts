const { Octokit } = require('@octokit/rest')

export default async (req, res) => {
  const octokit = new Octokit({
    // auth: 
    // github token for a particular user, leaving empty for now
  })
  const username = "anandrajaram21"    // need to get the input from the user for this  

  // Number of followers
  const followers = await octokit.request(`/users/${username}/followers?per_page=100`)
  const followerCount = followers.data.length

  // Get all repos 
  const repos = await octokit.request(`/users/${username}/repos`);

  // Number of stars
  const starsCount = repos.data.filter(repo => !repo.fork).reduce((acc, item) => {
      return acc + item.stargazers_count
  }, 0)

  // Number of starred repos
  const reposStarred = await octokit.request(`/users/${username}/starred`)
  const starredCount = reposStarred.data.length

  // Number of issues 
  const issueCount = repos.data.filter(repo => !repo.fork).reduce((acc, item) => {
    console.log(item.open_issues)
    return acc + item.open_issues
  }, 0)

  // List of repos 
  const repo_names = repos.data.map(repo => repo.name)

  // Number of repos
  const num_repos = repo_names.length

  /* Get the data related to the issues of a repository */ 
  // Loop through the repo names 
  const issueLinks = repos.data.map(repo => repo.issues_url.slice(0, -9))

  // Note: Just getting the issue links right now but we can loop through 
  // these and get data about all issues pertaining to public repos

  // for API Testing 
  console.log(repos) 

  // Return the counts
  return res.status(200).json({ 
    stars: starsCount, 
    followers: followerCount, 
    starred: starredCount, 
    all_repos: repo_names, 
    repo_count: num_repos, 
    issues: issueLinks, 
    issue_count: issueCount 
  })
}