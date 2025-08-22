# Requirements Document

## Introduction

This feature integrates X (Twitter) authentication and wallet connection functionality into the main application route, similar to the existing implementation in the invite route. Users will be able to authenticate with their X account and subsequently connect their crypto wallets (both Solana and EVM) within the main dashboard interface.

## Requirements

### Requirement 1

**User Story:** As a user visiting the main application, I want to authenticate with my X (Twitter) account, so that I can access personalized features and connect my wallets.

#### Acceptance Criteria

1. WHEN a user visits the main application without being authenticated THEN the system SHALL display a login interface
2. WHEN a user clicks the X login button THEN the system SHALL initiate the X OAuth flow
3. WHEN the X authentication is successful THEN the system SHALL create or update the user record in the database
4. WHEN the user is authenticated THEN the system SHALL redirect them to the main dashboard
5. IF the X authentication fails THEN the system SHALL display an appropriate error message

### Requirement 2

**User Story:** As an authenticated user in the main application, I want to connect my crypto wallets, so that I can interact with blockchain features.

#### Acceptance Criteria

1. WHEN an authenticated user accesses the main dashboard THEN the system SHALL display wallet connection options
2. WHEN a user clicks connect wallet THEN the system SHALL show available wallet options (Phantom, MetaMask, etc.)
3. WHEN a user selects a Solana wallet THEN the system SHALL initiate the Solana wallet connection flow
4. WHEN a user selects an EVM wallet THEN the system SHALL initiate the EVM wallet connection flow
5. WHEN a wallet connection is successful THEN the system SHALL store the wallet information in the global state
6. WHEN multiple wallets are connected THEN the system SHALL allow users to switch between them

### Requirement 3

**User Story:** As an authenticated user with connected wallets, I want to see my authentication and wallet status in the interface, so that I can understand my current connection state.

#### Acceptance Criteria

1. WHEN a user is authenticated THEN the system SHALL display their X profile information (name, avatar)
2. WHEN wallets are connected THEN the system SHALL display connected wallet addresses
3. WHEN a user wants to disconnect THEN the system SHALL provide logout and wallet disconnect options
4. WHEN a user logs out THEN the system SHALL clear the authentication session and wallet connections
5. WHEN the page is refreshed THEN the system SHALL maintain the authentication and wallet connection state

### Requirement 4

**User Story:** As a user, I want the authentication flow to be consistent across different parts of the application, so that I have a familiar experience.

#### Acceptance Criteria

1. WHEN implementing the main auth flow THEN the system SHALL reuse existing authentication components and patterns
2. WHEN displaying login modals THEN the system SHALL use the same styling and branding as the invite flow
3. WHEN handling authentication errors THEN the system SHALL provide consistent error messaging
4. WHEN managing user sessions THEN the system SHALL use the same NextAuth configuration and callbacks

### Requirement 5

**User Story:** As a developer, I want the authentication integration to be maintainable and follow existing patterns, so that the codebase remains consistent.

#### Acceptance Criteria

1. WHEN implementing new components THEN the system SHALL follow existing component structure and naming conventions
2. WHEN adding authentication logic THEN the system SHALL integrate with existing AuthContext and session management
3. WHEN handling wallet connections THEN the system SHALL use the existing GlobalWalletProvider and wallet store
4. WHEN creating UI components THEN the system SHALL use the existing design system and theme components
5. WHEN adding API endpoints THEN the system SHALL follow existing API patterns and error handling
