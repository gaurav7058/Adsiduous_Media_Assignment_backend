//Problem 1: Meeting Room Scheduler
function meetingRoomScheduler(meetings) {
    if (meetings.length === 0) return [true, 0];
  
    const startTimes = meetings.map(m => m[0]).sort((a, b) => a - b);
    const endTimes = meetings.map(m => m[1]).sort((a, b) => a - b);
  
    let usedRooms = 0;
    let maxRooms = 0;
    let startPtr = 0, endPtr = 0;
  
    while (startPtr < meetings.length) {
      if (startTimes[startPtr] < endTimes[endPtr]) {
        usedRooms++;
        startPtr++;
        maxRooms = Math.max(maxRooms, usedRooms);
      } else {
        usedRooms--;
        endPtr++;
      }
    }
  
    return [maxRooms === 1, maxRooms];
  }
  
  const meetings = [[1, 4], [2, 5], [7, 9]];
  const [isOneRoomEnough, minRoomsNeeded] = meetingRoomScheduler(meetings);
  console.log(isOneRoomEnough);  // false
  console.log(minRoomsNeeded);   // 2


//Problem 2: API Rate Limiter

class RateLimiter {
  constructor(limit, window) {
    this.limit = limit;           // Max number of requests
    this.window = window;         // Time window in seconds
    this.userRequests = new Map(); // Stores request timestamps per user
  }

  allow_request(userId, currentTime) {
    if (!this.userRequests.has(userId)) {
      this.userRequests.set(userId, []);
    }

    const requests = this.userRequests.get(userId);

    // Remove timestamps outside the sliding window
    while (requests.length > 0 && currentTime - requests[0] >= this.window) {
      requests.shift();
    }

    if (requests.length < this.limit) {
      requests.push(currentTime);
      return true;
    } else {
      return false;
    }
  }
}
const rl = new RateLimiter(3, 60);

console.log(rl.allow_request("user1", 1));   // true
console.log(rl.allow_request("user1", 20));  // true
console.log(rl.allow_request("user1", 30));  // true
console.log(rl.allow_request("user1", 40));  // false (limit reached)

//Problem 3: Directory File Size Analyzer

function getTotalSize(fs, path) {
  const parts = path.split('/');
  let current = fs;

  // Traverse down the path
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return 0; // Path does not exist
    }
  }

  // Recursive function to calculate total file size
  function calculateSize(node) {
    let total = 0;
    for (const key in node) {
      if (typeof node[key] === 'number') {
        total += node[key]; // It's a file
      } else if (typeof node[key] === 'object') {
        total += calculateSize(node[key]); // It's a subfolder
      }
    }
    return total;
  }

  return calculateSize(current);
}

// Example usage in Node.js
const filesystem = {
  root: {
    "file1.txt": 100,
    folder1: {
      "file2.txt": 200,
      folder2: {
        "file3.txt": 300
      }
    }
  }
};

console.log(getTotalSize(filesystem, "root/folder1")); // Output: 500
