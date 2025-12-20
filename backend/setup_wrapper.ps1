$baseUrl = "https://raw.githubusercontent.com/spring-projects/spring-petclinic/main"
$destDir = "c:\Users\seeth\Documents\SyntaxArena\backend"

# Ensure directories exist
New-Item -ItemType Directory -Force -Path "$destDir\.mvn\wrapper" | Out-Null

# Files to download (excluding jar, assuming script downloads it or we try to get it if possible)
# Note: standard git repos usually ignore the jar, so we might need to rely on the script bootstrapping.
$files = @(
    @{Url="mvnw"; Dest="$destDir\mvnw"},
    @{Url="mvnw.cmd"; Dest="$destDir\mvnw.cmd"},
    @{Url=".mvn/wrapper/maven-wrapper.properties"; Dest="$destDir\.mvn\wrapper\maven-wrapper.properties"}
)

# Download loop
foreach ($file in $files) {
    $url = "$baseUrl/$($file.Url)"
    $output = $file.Dest
    Write-Host "Downloading $url to $output"
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -ErrorAction Stop
        Write-Host "Success: $output"
    } catch {
        Write-Error "Failed to download $url : $_"
        exit 1
    }
}

Write-Host "Maven Wrapper scripts installed. Attempting to run mvnw to verification..."
