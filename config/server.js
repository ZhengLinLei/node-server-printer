const SERVER_CONFIG = {
    "name": "node-server-printer",
    // REPLACE TO YOUR DEFAULT PORT
    "port": 3000,
    "welcome-text": "Server on port: $port", // Variables: $port, $ip, $domain

    // SERVER OS
    "os": "win32" // Values ["win32", "unix"]
}

module.exports = SERVER_CONFIG;