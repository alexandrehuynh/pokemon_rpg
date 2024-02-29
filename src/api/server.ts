let accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcwOTE2NTYyNywianRpIjoiMjBjMzNlNjUtMTY0ZC00OWIyLTllZDgtMjU1OTk5NDlhZDBmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6Ijk5MTNkZGIyLTk2MzYtNDU0OC05MGU4LTI5YTE2YTM3M2Q0NiIsIm5iZiI6MTcwOTE2NTYyNywiY3NyZiI6ImM0ZTNkNTRmLTY0NTUtNDViZi04OGY5LTIwYzlhYTkxYWY5NCIsImV4cCI6MTc0MDcwMTYyN30.FwBth66ejbAl9VCMPgM9fQekn0AZI7ZB3HQhVQEbjWw"
let userId = localStorage.getItem('uuid') //grabbing the uuid from Google Authentication 



// putting all our API calls in a giant dictionary/object

export const serverCalls = {

    getPokemon: async () => {
        // api call consist of 1-4 things 
        // 1. url (required)
        // 2. method (optional it will default to GET)
        // 3. headers (optional but usually there) authentication type & type of data 
        // 4. body (optional usually only on a POST, PUT and sometimes DELETE)
        const response = await fetch(`https://rangers-elite-4.onrender.com/api/pokecenter`, {
            method: 'Get',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data'), response.status 
        }

        return await response.json()

    }
}