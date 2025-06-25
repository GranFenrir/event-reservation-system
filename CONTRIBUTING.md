# Contributing to Event Reservation System

Thank you for your interest in contributing! This document provides guidelines
and best practices for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)

## 🤝 Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to
uphold this code. Please report unacceptable behavior to the project
maintainers.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose
- Git

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/event-reservation-system.git
cd event-reservation-system

# Install dependencies
npm run install:all

# Start infrastructure
docker-compose up -d

# Start development servers
npm run dev
```

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/add-seat-selection
```

### 2. Make Your Changes

- Follow the [Code Standards](#code-standards)
- Write tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Run tests
npm run test

# Run e2e tests
npm run test:e2e
```

### 4. Commit Your Changes

Follow our [Commit Message Convention](#commit-message-convention)

```bash
git add .
git commit -m "feat(frontend): add interactive seat selection component"
```

### 5. Push and Create PR

```bash
git push origin feature/add-seat-selection
```

Then create a Pull Request on GitHub.

## 📝 Code Standards

### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Avoid `any` types - use proper typing
- Use meaningful variable and function names

```typescript
// ✅ Good
interface CreateEventRequest {
  title: string;
  description: string;
  startDate: Date;
  venue: VenueInfo;
}

// ❌ Bad
interface EventReq {
  t: string;
  d: string;
  date: any;
  v: any;
}
```

### React Components

- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript interfaces for props
- Follow single responsibility principle

```tsx
// ✅ Good
interface EventCardProps {
  event: Event;
  onReserve: (eventId: string) => void;
  isLoading?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onReserve,
  isLoading = false,
}) => {
  // Component implementation
};
```

### NestJS Services

- Use dependency injection properly
- Implement proper error handling
- Add comprehensive logging
- Use DTOs for validation

```typescript
// ✅ Good
@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private logger: Logger
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    try {
      this.logger.log('Creating new event', { dto: createEventDto });

      const event = this.eventRepository.create(createEventDto);
      return await this.eventRepository.save(event);
    } catch (error) {
      this.logger.error('Failed to create event', error);
      throw new InternalServerErrorException('Event creation failed');
    }
  }
}
```

### File Organization

```
src/
├── components/          # Reusable UI components
├── pages/              # Next.js pages
├── hooks/              # Custom React hooks
├── services/           # API services
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── constants/          # Application constants
└── __tests__/          # Test files
```

## 🧪 Testing Guidelines

### Unit Tests

- Test all business logic
- Mock external dependencies
- Use descriptive test names
- Aim for >80% code coverage

```typescript
describe('EventService', () => {
  describe('createEvent', () => {
    it('should create event successfully with valid data', async () => {
      // Test implementation
    });

    it('should throw error when venue is not available', async () => {
      // Test implementation
    });
  });
});
```

### Integration Tests

- Test API endpoints end-to-end
- Use test database
- Clean up test data after each test

### E2E Tests

- Test critical user journeys
- Use realistic test data
- Test on multiple browsers/devices

## 📜 Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/)
specification:

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(frontend): add seat selection component
fix(payment): resolve stripe webhook timeout issue
docs(readme): update installation instructions
refactor(api): extract common validation logic
```

## 🔄 Pull Request Process

### Before Creating a PR

1. ✅ Code follows style guidelines
2. ✅ Tests pass locally
3. ✅ Documentation is updated
4. ✅ No merge conflicts with main branch

### PR Description Template

```markdown
## 📝 Description

Brief description of changes

## 🔄 Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## 🧪 Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## 📷 Screenshots (if applicable)

[Add screenshots for UI changes]

## 🔗 Related Issues

Closes #123
```

### Review Criteria

- Code quality and adherence to standards
- Test coverage and quality
- Performance impact
- Security considerations
- Documentation completeness

## 🆘 Getting Help

- 📚 Check existing documentation
- 🔍 Search existing issues
- 💬 Join our Discord community
- 📧 Contact maintainers at dev@yourorg.com

## 🏷️ Versioning

We use [Semantic Versioning](https://semver.org/):

- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes (backward compatible)

Thank you for contributing! 🎉
