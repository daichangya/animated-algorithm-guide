---
title: Longest Common Subsequence (LCS) Algorithm | Principles and Animation Demo
description: Detailed explanation of the Longest Common Subsequence algorithm's principles, dynamic programming implementation and applications, including interactive animation demo and Python, Java code implementations
keywords: Longest Common Subsequence, LCS algorithm, dynamic programming, sequence comparison, text diff, bioinformatics, algorithm visualization
---

# **Longest Common Subsequence (LCS) Algorithm**

## Algorithm Introduction

The Longest Common Subsequence (LCS) algorithm is a classic dynamic programming algorithm used to find the longest subsequence common to two sequences. Unlike the Myers diff algorithm which directly computes edit operations, LCS focuses on identifying shared portions between sequences. LCS has wide applications in bioinformatics, file comparison, version control systems, and natural language processing.

## Algorithm Principles

LCS algorithm is based on these core concepts:

### Subsequence and Common Subsequence

- **Subsequence**: A new sequence derived from another sequence by deleting some elements (possibly none). For example, "ACE" is a subsequence of "ABCDE".
- **Common Subsequence**: A sequence that is a subsequence of both input sequences. For example, "BC" is a common subsequence of "ABCD" and "XBCZ".
- **Longest Common Subsequence**: The longest of all common subsequences.

### Dynamic Programming Approach

LCS uses dynamic programming by building a 2D table to store intermediate results:

1. State definition: `dp[i][j]` represents the length of LCS between first i elements of sequence A and first j elements of sequence B.
2. State transition:
   - If A[i-1] = B[j-1], then `dp[i][j] = dp[i-1][j-1] + 1`
   - Otherwise, `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`
3. Boundary conditions: `dp[0][j] = dp[i][0] = 0` (LCS length is 0 for empty sequences)

## Algorithm Steps

1. **Initialization**:
   - Create a (n+1) × (m+1) 2D array dp, where n and m are lengths of sequences A and B
   - Initialize first row and first column to 0

2. **Fill dp table**:
   - For each position (i,j), 1 ≤ i ≤ n, 1 ≤ j ≤ m:
     - If A[i-1] = B[j-1], then dp[i][j] = dp[i-1][j-1] + 1
     - Else, dp[i][j] = max(dp[i-1][j], dp[i][j-1])

3. **Backtrack to construct LCS**:
   - Start from dp[n][m]
   - If A[i-1] = B[j-1], add this character to LCS and move to dp[i-1][j-1]
   - Else, move to dp[i-1][j] or dp[i][j-1] (whichever is larger)

## Example Walkthrough

Let's understand LCS with an example. Suppose we have two strings:
- A = "ABCBDAB"
- B = "BDCABA"

### Building dp Table

We build an 8×7 table:

```
    |   | B | D | C | A | B | A
----+---+---+---+---+---+---+---
    | 0 | 0 | 0 | 0 | 0 | 0 | 0
----+---+---+---+---+---+---+---
  A | 0 | 0 | 0 | 0 | 1 | 1 | 1
----+---+---+---+---+---+---+---
  B | 0 | 1 | 1 | 1 | 1 | 2 | 2
----+---+---+---+---+---+---+---
  C | 0 | 1 | 1 | 2 | 2 | 2 | 2
----+---+---+---+---+---+---+---
  B | 0 | 1 | 1 | 2 | 2 | 3 | 3
----+---+---+---+---+---+---+---
  D | 0 | 1 | 2 | 2 | 2 | 3 | 3
----+---+---+---+---+---+---+---
  A | 0 | 1 | 2 | 2 | 3 | 3 | 4
----+---+---+---+---+---+---+---
  B | 0 | 1 | 2 | 2 | 3 | 4 | 4
```

### Backtracking to Build LCS

```
Start from dp[7][6] = 4:
1. A[6] = B[5] = 'A', add to LCS, move to dp[6][5]
2. A[5] = 'D' ≠ B[4] = 'A', dp[5][5] > dp[6][4], move to dp[5][5]
3. A[4] = 'B' = B[4] = 'B', add to LCS, move to dp[4][4]
4. A[3] = 'C' ≠ B[3] = 'A', dp[3][4] = dp[4][3], move to dp[3][4]
5. A[2] = 'C' ≠ B[2] = 'C', dp[2][4] > dp[3][3], move to dp[2][4]
6. A[1] = 'B' = B[0] = 'B', add to LCS, move to dp[1][0]
7. Reach boundary
```

Thus, LCS is "BBA" (reversed) or "ABB" (forward).

## Animation Demo

<div style="width:100%; height:600px; margin:20px 0; position:relative;" class="algorithm-container">
    <iframe id="lcs-iframe" src="../lcs.html" style="width:100%; height:100%; border:none;"></iframe>
    <button onclick="toggleFullScreen('lcs-iframe')" class="fullscreen-btn" style="position:absolute; top:10px; right:10px; background-color:rgba(0,0,0,0.5); color:white; border:none; border-radius:4px; padding:5px 10px; cursor:pointer; z-index:100;">
        <span>⛶</span> Fullscreen
    </button>
</div>

<script>
// Execute after page load
window.addEventListener('load', function() {
    // Ensure fullscreen functionality is available on all pages
    if (typeof window.toggleFullScreen !== 'function') {
        window.toggleFullScreen = function(iframeId) {
            const iframe = document.getElementById(iframeId);
            
            if (!iframe) {
                console.error('Cannot find iframe element with ID ' + iframeId);
                return;
            }
            
            // Try to open a new window showing the iframe content
            const url = iframe.src;
            const newWindow = window.open(url, '_blank', 'width=800,height=600');
            
            if (!newWindow) {
                alert('Popup was blocked. Please allow popups for this site, or try using browser fullscreen (F11).');
            }
        };
    }
});
</script>

## Code Implementation

=== "Python"
    ```python
    def longest_common_subsequence(a, b):
        """
        Compute the longest common subsequence between two sequences
        
        Args:
            a: First sequence
            b: Second sequence
            
        Returns:
            The longest common subsequence
        """
        n = len(a)
        m = len(b)
        
        # Create dp table
        dp = [[0] * (m + 1) for _ in range(n + 1)]
        
        # Fill dp table
        for i in range(1, n + 1):
            for j in range(1, m + 1):
                if a[i-1] == b[j-1]:
                    dp[i][j] = dp[i-1][j-1] + 1
                else:
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
        
        # Backtrack to build LCS
        lcs = []
        i, j = n, m
        while i > 0 and j > 0:
            if a[i-1] == b[j-1]:
                lcs.append(a[i-1])
                i -= 1
                j -= 1
            elif dp[i-1][j] > dp[i][j-1]:
                i -= 1
            else:
                j -= 1
        
        # Reverse to get correct order
        return ''.join(reversed(lcs))
    
    # Test
    a = "ABCBDAB"
    b = "BDCABA"
    lcs = longest_common_subsequence(a, b)
    print(f"Sequence A: {a}")
    print(f"Sequence B: {b}")
    print(f"Longest Common Subsequence: {lcs}")
    ```

=== "Java"
    ```java
    public class LongestCommonSubsequence {
        public static void main(String[] args) {
            String a = "ABCBDAB";
            String b = "BDCABA";
            String lcs = findLCS(a, b);
            System.out.println("Sequence A: " + a);
            System.out.println("Sequence B: " + b);
            System.out.println("Longest Common Subsequence: " + lcs);
        }
        
        public static String findLCS(String a, String b) {
            int n = a.length();
            int m = b.length();
            
            // Create dp table
            int[][] dp = new int[n + 1][m + 1];
            
            // Fill dp table
            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= m; j++) {
                    if (a.charAt(i - 1) == b.charAt(j - 1)) {
                        dp[i][j] = dp[i - 1][j - 1] + 1;
                    } else {
                        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                    }
                }
            }
            
            // Backtrack to build LCS
            StringBuilder lcs = new StringBuilder();
            int i = n, j = m;
            while (i > 0 && j > 0) {
                if (a.charAt(i - 1) == b.charAt(j - 1)) {
                    lcs.append(a.charAt(i - 1));
                    i--;
                    j--;
                } else if (dp[i - 1][j] > dp[i][j - 1]) {
                    i--;
                } else {
                    j--;
                }
            }
            
            // Reverse to get correct order
            return lcs.reverse().toString();
        }
    }
    ```

## Complexity Analysis

- **Time complexity**: O(n×m)
  - Need to fill n×m dp table
  - Each cell computation is O(1) operation

- **Space complexity**: O(n×m)
  - Need to store n×m dp table
  - Can be optimized to O(min(n,m)) by storing only two rows/columns

## Relationship Between LCS and Diff Algorithms

LCS is closely related to diff algorithms like Myers diff:

1. **Diff representation**: After finding LCS, elements not in LCS can be marked as insertions or deletions
   - Elements in A not in LCS represent deletions
   - Elements in B not in LCS represent insertions

2. **Edit distance**: Edit distance = len(A) + len(B) - 2×len(LCS)
   - Because each element not in LCS requires one edit operation

3. **Efficiency comparison**:
   - LCS: O(n×m) time, suitable for general cases
   - Myers: O(n×d) time, more efficient when edit distance d is much smaller than sequence lengths

## Algorithm Optimizations

Common LCS optimizations:

1. **Space optimization**:
   - Store only two rows/columns of dp values, reducing space to O(min(n,m))
   - Use rolling array technique

2. **Pruning optimization**:
   - Precompute common prefixes/suffixes, apply LCS only to middle portions
   - Particularly effective for very long sequences with small differences

3. **Divide and conquer**:
   - Break problem into smaller subproblems
   - Can be combined with parallel computing for large sequence comparisons

## Applications

LCS has wide applications:

1. **Bioinformatics**:
   - DNA and protein sequence alignment
   - Genome research and evolutionary analysis

2. **Text comparison**:
   - File diff tools (like diff)
   - Plagiarism detection systems

3. **Version control systems**:
   - Identifying changes between file versions
   - Merging different versions

4. **Natural language processing**:
   - Text similarity computation
   - Automatic summarization

5. **Data compression**:
   - Basis for some delta compression algorithms

## Exercises

1. **Basic implementation**: Implement LCS to find longest common subsequence between two strings.

2. **Space optimization**: Modify LCS to use only O(min(n,m)) space.

3. **Application**: Implement a simple text diff tool using LCS to highlight insertions and deletions.

4. **Extension**: Implement Longest Common Substring algorithm (different from LCS as substrings must be contiguous).

5. **Multi-sequence LCS**: Extend LCS to handle three or more sequences.

6. **LCS and edit distance**: Prove and implement: edit distance = len(A) + len(B) - 2×len(LCS), explaining the formula.

7. **Efficient implementation**: Implement an efficient LCS for very long sequences (like genomic data) combining multiple optimizations.

## References

1. Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). "Introduction to Algorithms" (3rd ed.). MIT Press. [Classic algorithms textbook with detailed LCS coverage]

2. Hirschberg, D. S. (1975). "A linear space algorithm for computing maximal common subsequences". Communications of the ACM, 18(6), 341-343. [Linear space LCS algorithm]

3. Hunt, J. W., & McIlroy, M. D. (1976). "An Algorithm for Differential File Comparison". Computing Science Technical Report, Bell Laboratories 41. [Early diff algorithm using LCS]

4. Myers, E. W. (1986). "An O(ND) Difference Algorithm and Its Variations". Algorithmica, 1(1), 251-266. [Related diff algorithm]

5. Bergroth, L., Hakonen, H., & Raita, T. (2000). "A survey of longest common subsequence algorithms". In Proceedings of the Seventh International Symposium on String Processing and Information Retrieval (SPIRE'00). [LCS survey paper]
