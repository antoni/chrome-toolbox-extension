import { KEY_ENTER } from "../constants"
import { clearAllNotifications, websiteSearch } from "./utils"

export const setupJiraControls = () => {
    // JIRA
    const jiraOpts = JSON.parse(localStorage.jiraOptions);
    const baseURL = jiraOpts.baseURL;
    const projectId = jiraOpts.pid;
    const issueType = jiraOpts.issueType;
    const priority = jiraOpts.priority;
    const ticketPrefix = jiraOpts.ticketPrefix;

    // Add JIRA bug
    $("#jira_bug_summary").keypress((e) => {
        if (e.keyCode === KEY_ENTER) {
            e.preventDefault();
            const bugSummary = $("#jira_bug_summary").val();
            const url = `https:\/\/${baseURL}\/secure\/CreateIssueDetails!`
                + `init.jspa?pid=${projectId}&summary=${bugSummary}&issuetype=`
                + `${issueType}&priority=${priority}`;
            chrome.tabs.create({ url });
            return false;
        }
    });

    // Open JIRA ticket
    $("#jira_ticket_id").keypress((e) => {
        if (e.keyCode === KEY_ENTER) {
            e.preventDefault();
            const searchURL = `https:\/\/${baseURL}/browse/${ticketPrefix}`;
            websiteSearch(searchURL, $("#jira_ticket_id").val());
            return false;
        }
    });
    clearAllNotifications();
}