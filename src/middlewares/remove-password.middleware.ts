// middleware/remove-password.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

function removePasswordRecursive(obj: any, depth = 0): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // Stop recursion after a certain depth
  if (depth > 2) {
    return obj;
  }

  // Recursively check nested objects
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === 'password') {
        // If the key is 'password', delete it
        delete obj[key];
      } else if (key === 'user' && obj[key] && typeof obj[key] === 'object') {
        // If the key is 'user' and it's an object, recursively check it
        obj[key] = removePasswordRecursive(obj[key], depth + 1);
      } else if (typeof obj[key] === 'object') {
        // If the value is an object, recursively check it
        obj[key] = removePasswordRecursive(obj[key], depth + 1);
      }
    }
  }

  return obj;
}

@Injectable()
export class RemovePasswordMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Use a flag to check whether the response has been modified
    let responseModified = false;

    // Override the send method to intercept the response body
    const originalSend = res.send;
    res.send = function (body: any): Response {
      if (body && !responseModified) {
        // Recursively check the response body for 'password' within 'user'
        body = removePasswordRecursive(JSON.parse(body));
        responseModified = true; // Set the flag to true after modification
      }

      // Continue with the original send method
      return originalSend.call(this, body);
    };

    // Continue to the next middleware or route handler
    next();
  }
}
