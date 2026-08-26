# Self-contained Maven downloader and runner for Windows Powershell
$maven_version = "3.9.6"
$maven_dir = Join-Path $PSScriptRoot ".maven"
$mvn_bin = Join-Path $maven_dir "apache-maven-$maven_version\bin\mvn.cmd"

if (-not (Test-Path $mvn_bin)) {
    Write-Host "Local Maven not found. Downloading Apache Maven $maven_version..."
    $url = "https://archive.apache.org/dist/maven/maven-3/$maven_version/binaries/apache-maven-$maven_version-bin.zip"
    $zip_file = Join-Path $PSScriptRoot "maven.zip"
    
    # Create target directory if needed
    if (-not (Test-Path $maven_dir)) {
        New-Item -ItemType Directory -Path $maven_dir -Force | Out-Null
    }
    
    # Download zip file
    Invoke-WebRequest -Uri $url -OutFile $zip_file
    Write-Host "Extracting Apache Maven..."
    Expand-Archive -Path $zip_file -DestinationPath $maven_dir -Force
    Remove-Item $zip_file
}

# Invoke Maven with arguments
& $mvn_bin @args
