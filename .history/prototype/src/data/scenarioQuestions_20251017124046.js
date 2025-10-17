// Scenario-based questions with rich context for cybersecurity assessment
export const scenarioQuestions = {
  'network-security': [
    {
      id: 'ns-scenario-1',
      difficulty: 'intermediate',
      type: 'scenario',
      title: 'Unusual Network Traffic Detected',
      context: `You are a network administrator at a mid-sized company. At 3:00 AM, your IDS (Intrusion Detection System) alerts you to unusual outbound traffic patterns:

- Multiple workstations sending data to an unfamiliar IP address in Eastern Europe
- Traffic volume: 2.5 GB transferred over the past hour
- Port used: 443 (HTTPS)
- Pattern: Steady stream, not typical user behavior
- Timing: Outside business hours

Your firewall logs show the connections originated from the finance department subnet.`,
      diagram: `
┌─────────────┐         ┌──────────┐         ┌─────────────┐
│  Finance    │────────▶│ Firewall │────────▶│ External IP │
│  Subnet     │  2.5GB  │   IDS    │  :443   │ 185.x.x.x   │
│ 10.0.2.x/24 │         │  ALERT!  │         │ (Europe)    │
└─────────────┘         └──────────┘         └─────────────┘
      `,
      question: 'What is the MOST appropriate immediate action?',
      options: [
        'Immediately shut down the entire company network to stop the data leak',
        'Block the external IP at the firewall and isolate affected workstations for forensic analysis',
        'Send an email to all finance department employees asking if they are working late',
        'Wait until morning to investigate as it might be scheduled backup traffic'
      ],
      correct: 1,
      explanation: `The correct approach is to block the IP and isolate affected systems. Here's why:

✓ CORRECT: Block and isolate
- Stops ongoing data exfiltration
- Preserves evidence for forensics
- Contains the incident without disrupting entire business
- Follows incident response best practices

✗ Why other options are wrong:
1. Shutting down entire network is too disruptive and unnecessary
3. Alerting potential attackers could cause them to cover tracks
4. Waiting allows more data loss and gives attackers time

This appears to be a data exfiltration attack, possibly from malware or a compromised account. The steady stream of data to an unusual location at odd hours is a classic indicator of compromise (IoC).`,
      learningPoints: [
        'Data exfiltration often happens during off-hours',
        'Block and isolate is better than complete shutdown',
        'Preserve evidence before alerting potential attackers',
        'Port 443 abuse is common to hide malicious traffic'
      ]
    },
    {
      id: 'ns-scenario-2',
      difficulty: 'advanced',
      type: 'scenario',
      title: 'Zero-Day Exploit Analysis',
      context: `You're the security analyst for a financial services company. A security researcher has published details about a zero-day vulnerability in your web server software:

CVE-2025-XXXX - Remote Code Execution
- Severity: CRITICAL (9.8/10)
- Affected: WebServer Pro v12.x - v12.4
- Your version: v12.3
- Exploit code: Publicly available
- Vendor patch: Available in 2 weeks

Your web server handles online banking transactions and is currently processing 10,000 transactions per hour. Taking it offline would cost approximately $50,000 per hour in lost revenue.`,
      diagram: `
Risk Assessment:
┌────────────────┐
│ Current State  │
├────────────────┤
│ ⚠️ Vulnerable  │
│ 💰 High Value  │
│ 🌐 Public-facing│
│ 🔓 Exploit Known│
└────────────────┘`,
      question: 'What is the BEST risk mitigation strategy while waiting for the vendor patch?',
      options: [
        'Take the server offline immediately until the official patch is released',
        'Deploy a Web Application Firewall (WAF) with custom rules to block known exploit patterns, enable enhanced monitoring, and prepare rollback plan',
        'Continue normal operations and rely on your antivirus to detect exploitation attempts',
        'Switch to the beta version of the software which reportedly fixes the issue'
      ],
      correct: 1,
      explanation: `The WAF strategy with enhanced monitoring is the best balanced approach:

✓ CORRECT: Deploy WAF with custom rules
- Blocks known exploit patterns at network perimeter
- Maintains business continuity
- Provides time to test official patch
- Enhanced monitoring detects breach attempts
- Rollback plan ready if WAF is bypassed

✗ Why other options are problematic:
1. $2.4M loss over 2 days is severe, impacts customers
3. AV cannot prevent web server exploitation effectively
4. Beta software may introduce new vulnerabilities

Defense-in-depth approach:
1. Deploy WAF rules immediately
2. Enable verbose logging
3. Set up real-time alerts
4. Prepare offline backups
5. Test vendor patch in staging
6. Deploy patch after validation

This demonstrates the principle of "defense while maintaining operations" - a key skill in production cybersecurity.`,
      learningPoints: [
        'Balance security risk against business impact',
        'WAF provides temporary protection for web vulnerabilities',
        'Never deploy untested patches/beta software in production',
        'Defense-in-depth means multiple protective layers'
      ]
    }
  ],
  'secure-coding': [
    {
      id: 'sc-scenario-1',
      difficulty: 'intermediate',
      type: 'scenario',
      title: 'SQL Injection Vulnerability Review',
      context: `You are reviewing a pull request from a junior developer who created a login function. The code is intended to check user credentials against a database:`,
      codeSnippet: {
        language: 'python',
        code: `def login_user(username, password):
    # Connect to database
    conn = get_database_connection()
    cursor = conn.cursor()
    
    # Check credentials
    query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'"
    cursor.execute(query)
    
    user = cursor.fetchone()
    if user:
        return {"success": True, "user_id": user[0]}
    else:
        return {"success": False, "error": "Invalid credentials"}`
      },
      question: 'What is the PRIMARY security vulnerability in this code?',
      options: [
        'The function does not use HTTPS for data transmission',
        'The code is vulnerable to SQL injection attacks because user input is concatenated directly into the SQL query',
        'The password is not being hashed before comparison',
        'The function does not implement rate limiting for login attempts'
      ],
      correct: 1,
      explanation: `This code has a critical SQL injection vulnerability:

✓ CORRECT: SQL Injection vulnerability
An attacker could input: username = "admin' --"
This would create the query:
SELECT * FROM users WHERE username = 'admin' -- ' AND password = ''

The -- comments out the password check, allowing login without a password!

🔒 SECURE VERSION:
\`\`\`python
def login_user(username, password):
    conn = get_database_connection()
    cursor = conn.cursor()
    
    # Use parameterized query (prepared statement)
    query = "SELECT * FROM users WHERE username = ? AND password = ?"
    cursor.execute(query, (username, hash_password(password)))
    
    user = cursor.fetchone()
    if user:
        return {"success": True, "user_id": user[0]}
    else:
        return {"success": False, "error": "Invalid credentials"}
\`\`\`

Why other issues exist but are less critical:
- Password hashing (option 3) IS a problem but comes after SQL injection in severity
- HTTPS (option 1) is a transport layer issue, not a code vulnerability
- Rate limiting (option 4) prevents brute force but doesn't stop SQL injection

OWASP Top 10: SQL Injection is #1 for a reason!`,
      learningPoints: [
        'NEVER concatenate user input into SQL queries',
        'Always use parameterized queries/prepared statements',
        'SQL injection can bypass all authentication',
        'Input validation is not enough - use proper query methods'
      ]
    },
    {
      id: 'sc-scenario-2',
      difficulty: 'advanced',
      type: 'scenario',
      title: 'Race Condition in Payment Processing',
      context: `You're reviewing the payment processing code for an e-commerce platform. A customer reported they were charged twice, but the company only shipped one item. Here's the payment verification code:`,
      codeSnippet: {
        language: 'javascript',
        code: `async function processPayment(userId, orderId, amount) {
    // Check user balance
    const user = await db.getUser(userId);
    
    if (user.balance >= amount) {
        // Deduct from balance
        await db.updateUser(userId, { 
            balance: user.balance - amount 
        });
        
        // Create order
        await db.createOrder({
            orderId: orderId,
            userId: userId,
            amount: amount,
            status: 'paid'
        });
        
        return { success: true };
    }
    
    return { success: false, error: 'Insufficient funds' };
}`
      },
      question: 'What security vulnerability allows the double-charge scenario?',
      options: [
        'The function does not validate that the amount is positive',
        'Race condition: Multiple simultaneous requests can pass the balance check before any updates are committed',
        'The function does not encrypt the payment data',
        'Integer overflow when calculating the new balance'
      ],
      correct: 1,
      explanation: `This is a classic race condition vulnerability (TOCTOU - Time Of Check, Time Of Use):

✓ CORRECT: Race Condition
Timeline of the attack:
\`\`\`
T=0: Request 1 checks balance: $100 >= $100 ✓
T=1: Request 2 checks balance: $100 >= $100 ✓
T=2: Request 1 updates balance: $100 - $100 = $0
T=3: Request 2 updates balance: $0 - $100 = -$100 💥
T=4: Both orders created successfully
\`\`\`

🔒 SECURE VERSION using database transaction with row locking:
\`\`\`javascript
async function processPayment(userId, orderId, amount) {
    const transaction = await db.beginTransaction();
    
    try {
        // Lock the user row FOR UPDATE
        const user = await transaction.getUser(userId, { lock: true });
        
        if (user.balance >= amount) {
            await transaction.updateUser(userId, { 
                balance: user.balance - amount 
            });
            
            await transaction.createOrder({
                orderId: orderId,
                userId: userId,
                amount: amount,
                status: 'paid'
            });
            
            await transaction.commit();
            return { success: true };
        } else {
            await transaction.rollback();
            return { success: false, error: 'Insufficient funds' };
        }
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
\`\`\`

Key security principles:
1. **Atomic Operations**: Check and update must be atomic
2. **Row Locking**: Prevent concurrent modifications
3. **Transactions**: All-or-nothing execution
4. **Idempotency**: Same request should produce same result`,
      learningPoints: [
        'Race conditions occur when check and action are separate',
        'Use database transactions with row locking for financial operations',
        'TOCTOU (Time Of Check, Time Of Use) is a common vulnerability',
        'Always test concurrent requests in payment systems'
      ]
    }
  ],
  'incident-response': [
    {
      id: 'ir-scenario-1',
      difficulty: 'intermediate',
      type: 'scenario',
      title: 'Ransomware Attack Response',
      context: `It's Monday 8:00 AM. Multiple employees report they cannot access their files. When they try to open documents, they see this message:

"YOUR FILES HAVE BEEN ENCRYPTED! Pay 5 Bitcoin to recover them. You have 48 hours."

Initial assessment reveals:
- 45 out of 200 workstations affected
- File shares on the network are encrypted
- Attack started Saturday night (2 days ago)
- Backups exist but haven't been tested in 6 months
- No offline backups
- Ransom amount: ~$200,000 USD`,
      diagram: `
Incident Timeline:
┌──────────────────────────────────┐
│ Sat 23:00 - Initial infection   │
│ Sun 01:00 - Lateral movement     │
│ Sun 03:00 - Encryption begins    │
│ Mon 08:00 - Discovery (NOW)      │
│ Tue 08:00 - Ransom deadline      │
└──────────────────────────────────┘`,
      question: 'What should be your FIRST priority in the incident response process?',
      options: [
        'Immediately pay the ransom to minimize business disruption',
        'Contain the incident by isolating affected systems and disconnecting infected network segments to prevent further spread',
        'Try to restore from backups immediately without testing them first',
        'Call a press conference to inform customers about the breach'
      ],
      correct: 1,
      explanation: `Containment is the critical first step in ransomware incident response:

✓ CORRECT: Contain the incident
Immediate actions (first 30 minutes):
1. Disconnect affected systems from network
2. Disable WiFi and unplug Ethernet cables
3. Isolate network segments
4. Shut down file shares
5. Preserve evidence (don't power off yet)

This prevents:
- Further encryption of files
- Lateral movement to unaffected systems
- Backup corruption
- More ransom demands

✗ Why other options are wrong:
1. Paying ransom:
   - No guarantee of file recovery
   - Encourages more attacks
   - May be illegal in some jurisdictions
   - Should be absolute last resort

3. Untested backup restoration:
   - Backups might be corrupted
   - Could overwrite evidence
   - May restore infected systems

4. Public notification:
   - Premature communication causes panic
   - Need to assess scope first
   - Required by law but not first step

📋 Complete IR Process (NIST):
1. ✓ Preparation (before incident)
2. ✓ Detection & Analysis (completed)
3. → **Containment** (YOUR ACTION NOW)
4. → Eradication (remove malware)
5. → Recovery (restore systems)
6. → Lessons Learned (post-incident)`,
      learningPoints: [
        'Containment prevents spread and limits damage',
        'Never pay ransom as first option',
        'Test backups regularly (3-2-1 backup rule)',
        'Offline backups are essential for ransomware defense'
      ]
    },
    {
      id: 'ir-scenario-2',
      difficulty: 'advanced',
      type: 'scenario',
      title: 'APT (Advanced Persistent Threat) Discovery',
      context: `Your security team discovered something concerning during routine log analysis:

FINDINGS:
- Unusual encrypted traffic to AWS server in Oregon for 8 months
- Traffic volume: Small but constant (2-5 MB daily)
- Source: Executive assistant's workstation
- The AWS account is NOT owned by your company
- Traffic occurs daily between 2-4 AM
- No malware detected by antivirus
- User reports no issues with their computer

Further investigation reveals:
- User's computer has legitimate remote access tools installed
- Browser has extension: "ProductivityBooster Pro"
- Extension has 5-star reviews, 10,000+ users
- DNS queries to unusual domains before AWS connection`,
      diagram: `
Attack Chain (suspected):
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │────▶│   Chrome     │────▶│  Unknown     │
│   Extension  │ C2  │   Extension  │ Data│  AWS Server  │
│   (Malware)  │     │   Calls API  │     │  (Oregon)    │
└──────────────┘     └──────────────┘     └──────────────┘
                           │
                           ▼
                     ┌──────────────┐
                     │  Corporate   │
                     │    Email     │
                     │   Calendar   │
                     └──────────────┘`,
      question: 'What type of attack is this MOST likely, and what should you do?',
      options: [
        'This is a false positive. The extension is highly rated so it must be safe. Ignore and continue monitoring.',
        'Supply chain attack via malicious browser extension conducting data exfiltration. Initiate full incident response: isolate system, analyze extension, check for similar infections, notify leadership.',
        'This is just aggressive telemetry from a legitimate extension. Ask the user to uninstall it and continue working.',
        'Immediately wipe the computer and reinstall Windows without further investigation.'
      ],
      correct: 1,
      explanation: `This is a sophisticated supply chain attack, likely an APT campaign:

✓ CORRECT: Supply chain attack with data exfiltration

🔍 Threat Analysis:
This exhibits classic APT characteristics:
- Long dwell time (8 months undetected)
- Low and slow data exfiltration
- Legitimate-looking tools (browser extension)
- Targeted (executive with access to sensitive data)
- AV evasion (living off the land)
- C2 infrastructure (AWS to blend in)

🚨 CRITICAL INCIDENT RESPONSE ACTIONS:

**Phase 1: Immediate (0-2 hours)**
1. DO NOT alert the user yet
2. Take memory dump of the workstation
3. Isolate system from network (physical disconnect)
4. Preserve browser data and extension files
5. Capture network traffic (PCAP)

**Phase 2: Investigation (2-24 hours)**
1. Reverse engineer the extension
2. Check extension on all corporate devices
3. Analyze 8 months of exfiltrated data
4. Identify what information was stolen
5. Check for additional persistence mechanisms
6. Threat intelligence lookup (IOCs, TTPs)

**Phase 3: Containment & Eradication (24-72 hours)**
1. Remove extension from all systems
2. Block AWS server at firewall
3. Block malicious domains
4. Force password resets for affected accounts
5. Check for lateral movement
6. Notify leadership and legal team

**Phase 4: Recovery & Lessons Learned**
1. Implement extension whitelisting
2. Enhanced monitoring for data exfiltration
3. Security awareness training
4. Incident report and IOCs sharing

✗ Why other options fail:
1. High ratings mean nothing (attackers fake reviews)
3. Missing the bigger picture - APT needs full investigation
4. Destroying evidence prevents forensics and IOC discovery

This scenario demonstrates why:
- Behavior analysis > Signature detection
- Dwell time matters in impact assessment
- Supply chain attacks bypass traditional defenses
- Executive targeting indicates espionage or IP theft`,
      learningPoints: [
        'APTs use legitimate tools and infrastructure',
        'Supply chain attacks are increasingly common',
        'Browser extensions can be powerful attack vectors',
        'Low and slow exfiltration evades detection',
        'Always preserve evidence before remediation'
      ]
    }
  ]
};

// Helper to get scenarios by domain and difficulty
export function getScenariosByDomain(domain, difficulty = null) {
  const scenarios = scenarioQuestions[domain] || [];
  if (difficulty) {
    return scenarios.filter(s => s.difficulty === difficulty);
  }
  return scenarios;
}

// Helper to get a random scenario
export function getRandomScenario(domain, difficulty = null) {
  const scenarios = getScenariosByDomain(domain, difficulty);
  return scenarios.length > 0 
    ? scenarios[Math.floor(Math.random() * scenarios.length)]
    : null;
}
