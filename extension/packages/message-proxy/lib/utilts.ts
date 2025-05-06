export function matchHostnameToPatterns(hostname: string, patterns: string[]): boolean {

  function wildcardToRegex(pattern: string): RegExp {
    // Pre-process the pattern by removing protocol & path
    // (1) Replace anything before //

    pattern = pattern.replace(/^[^/]+:\/\//, '');
    // (2) Replace anything after /
    pattern = pattern.replace(/\/.*$/, '');

    // Escape dots, replace asterisks with regex equivalents
    const regexPattern = pattern
        .replace(/([.?+^$[\]\\(){}|-])/g, '\\$1') // Escape special regex characters
        .replace(/\*/g, '.*'); // Convert * to .*
    return new RegExp('^' + regexPattern + '$');
  }

  // Check each pattern against the hostname
  for (const pattern of patterns) {
    const regex = wildcardToRegex(pattern);
    if (regex.test(hostname)) {
      return true;
    }
  }
  return false;
}
