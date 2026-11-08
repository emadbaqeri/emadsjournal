import { expect, test } from '@playwright/test';
import { cutSeconds, formatClock, mediaFromSrc, parseSrt } from '../../src/lib/motion';

const sample = `1
00:00:00,000 --> 00:00:01,500
First line.

2
00:00:01,500 --> 00:00:02,000
Second line.
`;

test('parses timestamped SRT cues', () => {
  expect(parseSrt(sample)).toEqual([
    { startSeconds: 0, endSeconds: 1.5, text: 'First line.' },
    { startSeconds: 1.5, endSeconds: 2, text: 'Second line.' },
  ]);
});

test('strips simple markup and a BOM', () => {
  const cues = parseSrt('\ufeff1\n00:00:00,000 --> 00:00:01,000\n<b>Bold</b> caption');
  expect(cues).toEqual([{ startSeconds: 0, endSeconds: 1, text: 'Bold caption' }]);
});

test('formats a clock and picks the 45 or 90 second cut', () => {
  expect(formatClock(2)).toBe('0:02');
  expect(formatClock(45)).toBe('0:45');
  expect(cutSeconds(2)).toBe(45);
  expect(cutSeconds(45)).toBe(45);
  expect(cutSeconds(90)).toBe(90);
});

test('derives mp4, webm, and poster paths from src', () => {
  expect(mediaFromSrc('/media/kitchen-sink-fixture.mp4')).toEqual({
    mp4: '/media/kitchen-sink-fixture.mp4',
    webm: '/media/kitchen-sink-fixture.webm',
    poster: '/media/kitchen-sink-fixture-poster.png',
  });
});
