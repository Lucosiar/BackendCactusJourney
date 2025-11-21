import { Injectable, PipeTransform } from '@nestjs/common';
import xss from 'xss';

@Injectable()
export class XssSanitizationPipe implements PipeTransform {
  transform(value: unknown): unknown {
    if (typeof value === 'string') {
      return xss(value);
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.transform(item));
    }

    if (value && typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>).reduce(
        (acc, [key, val]) => {
          acc[key] = this.transform(val);
          return acc;
        },
        {} as Record<string, unknown>,
      );
    }

    return value;
  }
}
