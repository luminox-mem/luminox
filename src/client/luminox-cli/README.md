# Luminox CLI

A lightweight command-line tool for quickly creating Luminox projects with templates.

## Features

- 🚀 **Quick Setup**: Create projects in seconds with interactive templates
- 🌐 **Multi-Language**: Support for Python and TypeScript
- 🐳 **Docker Ready**: One-command Docker Compose deployment
- 🔧 **Auto Git**: Automatic Git repository initialization
- 🔄 **Auto Update**: Automatic version checking and one-command upgrade
- 🎯 **Simple**: Minimal configuration, maximum productivity

## Installation

### User Installation (No sudo required - Recommended)

By default, the CLI installs to `~/.luminox/bin` and automatically updates your shell profile (`.bashrc`, `.zshrc`, etc.):

```bash
# Install script (Linux, macOS, WSL)
curl -fsSL https://install.luminox.io | sh
```

After installation, restart your shell or run `source ~/.bashrc` (or `~/.zshrc` for zsh).

### System-wide Installation (Requires sudo)

For system-wide installation to `/usr/local/bin`:

```bash
curl -fsSL https://install.luminox.io | sh -s -- --system
```

### Homebrew (macOS)

```bash
brew install luminox/tap/luminox-cli
```

## Usage

### Create a New Project

```bash
# Interactive mode
luminox create

# Use default templates (Python OpenAI or TypeScript Vercel AI)
luminox create my-project

# Use custom template from Luminox-Examples repository
luminox create my-project --template-path "python/custom-template"
# or
luminox create my-project -t "typescript/my-custom-template"
```

**Templates:**

The CLI automatically discovers all available templates from the [Luminox-Examples](https://github.com/memodb-io/Luminox-Examples) repository. When you run `luminox create`, you'll see a list of all templates available for your selected language.

Templates are organized by language:
- `python/` - Python templates (openai, anthropic, etc.)
- `typescript/` - TypeScript templates (vercel-ai, langchain, etc.)

You can also use any custom template folder by specifying the path with `--template-path`.

### Docker Deployment

```bash
# Start all services
luminox docker up

# Check status
luminox docker status

# View logs
luminox docker logs

# Stop services
luminox docker down
```

### Version Management

```bash
# Check version (automatically checks for updates)
luminox version

# Upgrade to the latest version
luminox upgrade
```

The CLI automatically checks for updates after each command execution. If a new version is available, you'll see a notification prompting you to run `luminox upgrade`.

## Development Status

**🎯 Current Progress**: Production Ready (~95% complete)  
**✅ Completed**: 
- ✅ Interactive project creation
- ✅ Multi-language template support (Python/TypeScript)
- ✅ Dynamic template discovery from repository
- ✅ Git repository initialization
- ✅ Docker Compose integration
- ✅ One-command deployment
- ✅ Version checking and auto-update
- ✅ CI/CD with GitHub Actions
- ✅ Automated releases with GoReleaser
- ✅ Comprehensive unit tests

## Documentation

- [Template Configuration](./templates/README.md) - Template configuration guide

## License

MIT