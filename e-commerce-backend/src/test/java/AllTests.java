import org.junit.jupiter.api.Test;

/**
 * Root-level smoke test to ensure directory-based runners always find at least one test
 * when pointed at src\\test\\java. This avoids "No tests were found" errors in some tools
 * that do not search subdirectories recursively.
 *
 * Note: This test is intentionally minimal and does not replace running the full suite by
 * module or fully qualified class names.
 */
public class AllTests {

    @Test
    void smoke() {
        // Intentionally left blank – existence ensures discovery.
    }
}
