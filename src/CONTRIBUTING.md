# Contributing to MaycoleTechnologies™

Thank you for your interest in contributing to **MaycoleTechnologies™**! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- VS Code (recommended) with suggested extensions
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/maycole-technologies-website.git
   cd maycole-technologies-website
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in VS Code**
   ```bash
   code .
   ```

## 📋 Development Guidelines

### Brand Identity

**CRITICAL**: Always maintain brand consistency

- **Company Name**: `MaycoleTechnologies™` (exact formatting with trademark)
- **Tagline**: `\"Changing The Future One Product At A Time\"`
- **Founder**: `Antonio G. Maycole`
- **Colors**: Green (`#1e7f3e`) and Gold (`#ffd700`)
- **Quality Standard**: Oracle-level professional presentation

### Code Standards

#### TypeScript
- Use strict typing - avoid `any` types
- Prefer explicit return types for functions
- Use proper interface definitions
- Follow naming conventions: PascalCase for components, camelCase for variables

#### React Components
- One component per file
- Use functional components with hooks
- Proper props typing with interfaces
- Follow component naming: `ComponentName.tsx`

#### Styling
- Use Tailwind CSS utilities
- Follow design system in `styles/globals.css`
- **IMPORTANT**: Don't override font sizes/weights without specific request
- Use brand color utilities: `.text-maycole-green`, `.text-maycole-gold`

### File Organization
```
components/
├── ui/              # shadcn/ui components (don't modify)
├── [ComponentName].tsx  # Main components
└── [ComponentName]-styles/  # Component-specific styles
```

## 🔧 Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Follow coding standards
- Test thoroughly
- Maintain brand guidelines
- Ensure responsive design

### 3. Test Your Changes
```bash
npm run lint          # Check for linting issues
npm run lint:fix      # Auto-fix linting issues
npm run build         # Ensure build works
```

### 4. Commit Changes
```bash
git add .
git commit -m "feat: add new feature description"
```

#### Commit Message Format
```
type(scope): description

Types:
- feat: new feature
- fix: bug fix
- docs: documentation
- style: formatting, missing semicolons, etc.
- refactor: code restructuring
- test: adding tests
- chore: updating build tasks, package.json, etc.
```

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 🎨 Design Guidelines

### Component Design
- **Professional**: Oracle/Apple level quality
- **Consistent**: Use established patterns
- **Responsive**: Mobile-first approach
- **Accessible**: WCAG 2.1 AA compliance

### Animation Standards
- Use Motion React for animations
- Smooth, professional transitions
- Performance-conscious implementations
- Subtle, not distracting

### Color Usage
```css
/* Company name - always green */
.maycole-company-name { color: #1e7f3e; }

/* Tagline - always gold */
.maycole-tagline { color: #ffd700; }

/* Gradients for headers */
.maycole-gradient-text { /* green to gold gradient */ }
```

## 🚫 What NOT to Do

### Brand Violations
- ❌ Don't change company name formatting
- ❌ Don't remove trademark symbols
- ❌ Don't use different colors for brand elements
- ❌ Don't compromise professional quality

### Code Violations
- ❌ Don't use `any` types
- ❌ Don't override typography without purpose
- ❌ Don't break responsive design
- ❌ Don't ignore accessibility

### Performance Issues
- ❌ Don't add large dependencies without justification
- ❌ Don't block the main thread
- ❌ Don't add unoptimized images
- ❌ Don't ignore build warnings

## 📝 Pull Request Guidelines

### PR Checklist
- [ ] Code follows style guidelines
- [ ] All tests pass (`npm run lint`, `npm run build`)
- [ ] Changes are responsive across devices
- [ ] Brand guidelines maintained
- [ ] Documentation updated if needed
- [ ] No performance regressions

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Cross-browser tested
- [ ] Performance tested

## Screenshots
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows guidelines
- [ ] Self-review completed
- [ ] Brand consistency maintained
```

## 🐛 Bug Reports

### Bug Report Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- Browser: [e.g. Chrome 120]
- Device: [e.g. iPhone 12]
- OS: [e.g. iOS 16]
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of the proposed feature

**Business Justification**
Why this feature is needed

**Proposed Solution**
How you envision this working

**Additional Context**
Any other relevant information
```

## 🔒 Security

- Report security vulnerabilities privately
- Don't commit secrets or API keys
- Follow security best practices
- Use environment variables for sensitive data

## 📞 Getting Help

- **Documentation**: Check `/guidelines/Guidelines.md`
- **Issues**: Create GitHub issue with appropriate template
- **Questions**: Use GitHub Discussions
- **Contact**: `contact@maycoletechnologies.com`

## 🏆 Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes (for significant contributions)
- Documentation credits

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**MaycoleTechnologies™** - Maintaining Oracle-level professional quality in every contribution.