import { isGMT } from './util';
import { GMT, Weekday } from './index';

const weekdays: Weekday[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/**
 * Only the first parameter is mandatory. Either the second, the third, or both
 * may be left out.
 *
 * If only one parameter is present, the function yeilds a true value on the
 * weekday that the parameter represents. If the string "GMT" is specified as
 * a second parameter, times are taken to be in GMT, otherwise in local timezone.
 *
 * If both wd1 and wd1 are defined, the condition is true if the current weekday
 * is in between those two weekdays. Bounds are inclusive. If the "GMT" parameter
 * is specified, times are taken to be in GMT, otherwise the local timezone is
 * used.
 *
 * Valid "weekday strings" are:
 *
 *     SUN MON TUE WED THU FRI SAT
 *
 * Examples:
 *
 * ``` js
 * weekdayRange("MON", "FRI")
 * true Monday trhough Friday (local timezone).
 *
 * weekdayRange("MON", "FRI", "GMT")
 * same as above, but GMT timezone.
 *
 * weekdayRange("SAT")
 * true on Saturdays local time.
 *
 * weekdayRange("SAT", "GMT")
 * true on Saturdays GMT time.
 *
 * weekdayRange("FRI", "MON")
 * true Friday through Monday (note, order does matter!).
 * ```
 *
 *
 * @param {String} wd1 one of the weekday strings.
 * @param {String} wd2 one of the weekday strings.
 * @param {String} gmt is either the string: GMT or is left out.
 * @return {Boolean}
 */

export default function weekdayRange(
	wd1: Weekday,
	wd2?: Weekday | GMT,
	gmt?: GMT
): boolean {
	let useGMTzone = false;
	let wd1Index = -1;
	let wd2Index = -1;
	let wd2IsGmt = false;

	if (isGMT(gmt)) {
		useGMTzone = true;
	} else if (isGMT(wd2)) {
		useGMTzone = true;
		wd2IsGmt = true;
	}

	wd1Index = weekdays.indexOf(wd1);

	if (!wd2IsGmt && isWeekday(wd2)) {
		wd2Index = weekdays.indexOf(wd2);
	}

	let todaysDay = getTodaysDay(useGMTzone);
	let result: boolean;

	if (wd2Index < 0) {
		result = todaysDay === wd1Index;
	} else if (wd1Index <= wd2Index) {
		result = valueInRange(wd1Index, todaysDay, wd2Index);
	} else {
		result =
			valueInRange(wd1Index, todaysDay, 6) ||
			valueInRange(0, todaysDay, wd2Index);
	}

	return result;
}

function getTodaysDay(gmt: boolean): number {
	return gmt ? new Date().getUTCDay() : new Date().getDay();
}

// start <= value <= finish
function valueInRange(start: number, value: number, finish: number): boolean {
	return start <= value && value <= finish;
}

function isWeekday(v: any): v is Weekday {
	return weekdays.indexOf(v) !== -1;
}
