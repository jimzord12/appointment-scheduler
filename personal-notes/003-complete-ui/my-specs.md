For this feature branch `003-complete-ui`, we will sorely focus on completing the user interface.

The Backend API needs some work so use the MSW (Mock Service Worker) to mock the API responses for now. You may also use Faker v10 to generate realistic mock data.

Currently there are a total of 10 pages (frontend\src\pages) that need to be finalized and polished.

I want you to use Shadcn UI components (v3+) wherever possible to ensure consistency and speed up development.

Shadcn is NOT installed yet, so please follow the instructions on https://ui.shadcn.com/docs/installation to set it up.
Also install the shadcn MCP server by running this command: `pnpm dlx shadcn@latest mcp init --client vscode`. Use it whenever you need to generate a component.

Additionally, ensure that Tailwind CSS is properly configured and integrated with the shadcn components.

Also, you need to use tweakcn to customize the Tailwind CSS theme to match the design specifications. You may use this command to install the theme: `pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/darkmatter.json`

By the end of this feature, I want the entire UI to be fully functional and visually appealing, adhering to the design guidelines provided.
