import type { HomeAssistant, IssueAction } from "./types";

export interface ActionExecutionDependencies {
  confirm: (message: string) => boolean | Promise<boolean>;
  navigate: (path: string) => void;
  openUrl: (path: string) => void;
  showMoreInfo: (entityId: string) => void;
}

export async function executeIssueAction(
  hass: HomeAssistant,
  entityId: string,
  action: IssueAction,
  dependencies: ActionExecutionDependencies,
): Promise<void> {
  if (action.confirmation) {
    const confirmed = await dependencies.confirm(`Run ${action.name ?? actionLabel(action)}?`);
    if (!confirmed) {
      return;
    }
  }

  if (action.action === "more-info") {
    dependencies.showMoreInfo(entityId);
    return;
  }
  if (action.navigation_path) {
    dependencies.navigate(action.navigation_path);
    return;
  }
  if (action.url_path) {
    dependencies.openUrl(action.url_path);
    return;
  }
  if (action.service) {
    if (!hass.callService) {
      throw new Error("Home Assistant service calling is not available.");
    }
    const [domain, service] = action.service.split(".", 2);
    await hass.callService(domain, service, action.data, action.target);
  }
}

export function actionLabel(action: IssueAction): string {
  if (action.name) {
    return action.name;
  }
  if (action.action === "more-info") {
    return "More info";
  }
  if (action.navigation_path) {
    return "Navigate";
  }
  if (action.url_path) {
    return "Open link";
  }
  return "Run service";
}

export function navigateHomeAssistant(path: string): void {
  window.history.pushState(null, "", path);
  window.dispatchEvent(
    new CustomEvent("location-changed", {
      detail: { replace: false },
    }),
  );
}
