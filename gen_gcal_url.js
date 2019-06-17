let event = {
	title: "title",
	description: "description",
	location: "test location",
	datetimeFrom: "20190508T075300Z",
	datetimeTo: "20190509T075300Z"
}

addslashes = (str) => str.replace(/ /g, '+');

getGoogleCalendarUrl = (event) => 
    `https://www.google.com/calendar/render?action=TEMPLATE` +
	`&text=${event.title}` +
	`&details=${event.description}` +
	`&location=${addslashes(event.location.toString())}` +
	`&dates=${event.datetimeFrom}\/${event.datetimeTo}`

getGoogleCalendarUrl(event)
