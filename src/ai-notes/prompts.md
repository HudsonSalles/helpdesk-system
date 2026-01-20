First prompt
Created in Claude.ai to define the PRD rules according to the technical test specifications.
The goal was to ensure the AI strictly followed the test requirements when designing the system architecture and features.
This process resulted in the file:
src/ai-notes/prd_helpdesk_system_support_tickets.md

---

Create a prd.md file with the project specifications, following the rules below:

Design a professional layout, always considering responsiveness and accessibility, using ARIA attributes only when necessary. Implement lazy loading and skeleton loading. Tailwind cannot be used; styling must be done with SCSS Modules. Component libraries such as shadcn or any other UI library are not allowed — all components must be built from scratch.

Create reusable components following a feature-based architecture (FEATURES).

Clearly separate logic and business rules.

Components must only receive props and must not contain business logic or application logic.

Do not add comments to the code.

Implement a 2-step form, preserving input data when navigating back to the previous step to avoid data loss. In case of connection loss or page refresh, the data must still be available when the user returns. After a successful submission, the form must follow the normal flow and clear all fields.

Add a login page with the following credentials:

Email: user@test.com.br

Password: 123Teste@

Always follow best practices for the chosen stacks.

Use Context7 to consult the official documentation of the stacks whenever implementing or modifying any functionality, ensuring adherence to best practices.

Add rules and guidelines expected from a senior frontend expert.

Create a Git CI/CD workflow.

Keep files at a reasonable size; if a file becomes too large, split it into smaller, more focused files.

---

Second prompt
Sent to the Copilot agent to generate and implement the initial project structure and codebase, strictly adhering to the previously defined PRD rules and architectural constraints.

follow the strictely this document prd_helpdesk_system_support.md to create this project, don't create nothing if there isn't in the file, use always the context7 to get the documentation for the best pratices for this project

---

Thirdy prompt

we are now in the develop branch. we will do the changes here, verify if in the git workflow has the parameter that after we create a pr to main and a test to avoid conflicts before merge
