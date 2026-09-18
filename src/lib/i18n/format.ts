/**
 * The whole of this project's message formatting.
 *
 * There are no plurals, no genders, no dates and no numbers in the copy, so
 * there is no ICU message formatter here and no dependency that ships one.
 * The single interpolated catalogue string is the footer copyright's
 * `{year}`; `%s` in `meta.default.titleTemplate` belongs to Next's metadata
 * layer and is substituted by Next, not here.
 *
 * Safe to import from Client Components — it holds no catalogue data.
 */

/**
 * Replaces `{name}` placeholders. An unknown placeholder is left verbatim
 * rather than blanked, so a mistake is visible in the render instead of
 * silently deleting copy.
 */
export function interpolate(
  template: string,
  values: Readonly<Record<string, string | number>>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
