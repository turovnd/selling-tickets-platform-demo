<template>
    <div class="calendar" :style="'width: ' + width + 'px'">
        <div class="calendar-wrapper">
            <div class="calendar-ctrl">
                <span
                    class="calendar-ctrl-btn angle-left"
                    @click="preNextMonthClick(0)"
                ></span>
                <span class="calendar-ctrl-header">
                    {{ stringifyHeader(currDate) }}
                </span>
                <span
                    class="calendar-ctrl-btn angle-right"
                    @click="preNextMonthClick(1)"
                ></span>
            </div>
            <div class="calendar-body">
                <div class="calendar-weekRange">
                    <div
                        class="calendar-cell"
                        v-for="(w, index) in daysOfWeek"
                        :key="index"
                    >
                        {{ w }}
                    </div>
                </div>
                <div class="calendar-dateRange">
                    <div
                        v-for="(d, k) in dateRange"
                        :key="k"
                        :style="'width: ' + (width / 7 + 2) + 'px'"
                        class="calendar-cell"
                        :class="getItemClasses(d)"
                        :data-date="stringify(d.date)"
                        @click="daySelect(d, $event)"
                    >
                        <div class="date">
                            {{ d.text }}
                        </div>
                        <div class="inform">
                            <span
                                v-if="
                                    minDateValue &&
                                        d.date >= parse(minDateValue)
                                "
                                :class="getAdditionalData(d.date).class"
                            >
                                {{ getAdditionalData(d.date).text }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'calendar',
    props: {
        value: {
            type: [String, Date]
        },
        width: {
            type: Number,
            default: 200
        },
        firstDayOfWeek: {
            // sunday
            type: Number,
            default: 0
        },
        disabledDaysOfWeek: {
            type: Array,
            default() {
                return [];
            }
        },
        lang: {
            type: String,
            default: 'en'
        },
        onDayClick: {
            type: Function,
            default() {}
        },
        additionalData: {
            type: Object,
            default() {
                return {};
            }
        },
        onDrawDate: {
            type: Function,
            default() {}
        },
        maxDate: {
            type: [String, Date]
        },
        minDate: {
            type: [String, Date]
        },
        i18n: {
            type: Object,
            default() {
                return {
                    en: {
                        daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        months: [
                            'January',
                            'February',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December'
                        ]
                    }
                };
            }
        }
    },
    mounted() {
        this.$emit('child-created', this);
        this.currDate = this.parse(this.inputValue) || this.parse(new Date());
        this.currDate.setHours(0, 0, 0);
    },
    data() {
        return {
            currDate: new Date(),
            dateRange: [],
            decadeRange: []
        };
    },
    watch: {
        currDate() {
            this.getDateRange();
        },
        value(v) {
            this.inputValue = v instanceof Date ? this.stringify(v) : v;
        }
    },
    computed: {
        // get real order of the daysOfWeek
        daysOfWeek() {
            const firstDay = this.firstDayOfWeek;
            if (firstDay === 0) {
                return this.text.daysOfWeek;
            }
            return this.text.daysOfWeek
                .slice(firstDay, 7)
                .concat(this.text.daysOfWeek.slice(0, firstDay));
        },
        // Return translations
        text() {
            return this.translations(this.lang);
        },
        // Selected date
        inputValue: {
            get() {
                if (this.value instanceof Date) {
                    return this.stringify(this.value);
                } else {
                    return this.value;
                }
            },
            set(v) {
                this.$emit('input', v);
                this.currDate = this.parse(v);
            }
        },
        minDateValue: {
            get() {
                if (this.minDate instanceof Date) {
                    return this.minDate;
                } else {
                    return this.parse(this.minDate);
                }
            }
        },
        maxDateValue: {
            get() {
                if (this.maxDate instanceof Date) {
                    return this.maxDate;
                } else {
                    return this.parse(this.maxDate, false);
                }
            }
        }
    },
    methods: {
        /**
         * Calls when date was drawn
         */
        __OnDrawDate(e) {
            let date = e.date;
            let maxDate = this.parse(this.maxDateValue, false);
            let minDate = this.parse(this.minDateValue, false);

            if (this.isDate(maxDate)) {
                maxDate.setHours(0, 0, 0);
                if (date.getTime() > maxDate.getTime()) {
                    e.allowSelect = false;
                }
            }
            if (this.isDate(minDate)) {
                minDate.setHours(0, 0, 0);
                if (date.getTime() < minDate.getTime()) {
                    e.allowSelect = false;
                }
            }
            this.$emit('drawdate', e);
            this.onDrawDate(e);
        },
        /**
         * Get class for the date
         *
         * @return {string}
         */
        getItemClasses(d) {
            d.allowSelect = true;
            this.__OnDrawDate(d);
            const clazz = [];
            clazz.push(d.sclass);
            if (d.allowSelect == false) {
                clazz.push('calendar-cell-disabled');
            }
            return clazz.join(' ');
        },
        /**
         * Return i18n translation
         *
         * @param lang
         * @return {Object}
         */
        translations(lang) {
            lang = lang || 'en';
            return this.i18n[lang];
        },
        /**
         * Previous/Next month button click
         *
         * @param flag  0 => previous, 1=> next
         */
        preNextMonthClick(flag) {
            const year = this.currDate.getFullYear();
            const month = this.currDate.getMonth();
            const date = this.currDate.getDate();
            if (flag === 0) {
                const preMonth = this.getYearMonth(year, month - 1);
                const lastDate = Math.min(
                    this.getDayCount(preMonth.year, preMonth.month),
                    date
                );
                this.currDate = new Date(
                    preMonth.year,
                    preMonth.month,
                    lastDate
                );
            } else {
                const nextMonth = this.getYearMonth(year, month + 1);
                const lastDate = Math.min(
                    this.getDayCount(nextMonth.year, nextMonth.month),
                    date
                );
                this.currDate = new Date(
                    nextMonth.year,
                    nextMonth.month,
                    lastDate
                );
            }
        },
        /**
         * Handle click on cell with date
         *
         * @param item
         * @param event
         * @return {boolean}
         */
        daySelect(item, event) {
            let date = item.date;
            let el = event.target;
            if (
                item.allowSelect === false ||
                el.classList.contains('calendar-cell-disabled')
            ) {
                return false;
            } else {
                this.onDayClick(date, this.stringify(date));
            }
        },
        /**
         * Get year month object
         *
         * @param year
         * @param month
         * @return {{year: *, month: *}}
         */
        getYearMonth(year, month) {
            if (month > 11) {
                year++;
                month = 0;
            } else if (month < 0) {
                year--;
                month = 11;
            }
            return { year: year, month: month };
        },
        /**
         * Get additional information for the date
         *
         * @param v
         * @return {*}
         */
        getAdditionalData(v) {
            let info = this.additionalData[this.stringify(v)];
            return {
                class: info ? info.class : '',
                text: info && info.text ? info.text[this.lang] : ''
            };
        },
        /**
         * Siblings month
         *
         * @param v
         * @return {Date}
         */
        siblingsMonth(v) {
            return new Date(v.getFullYear(), v.getMonth());
        },
        /**
         * Stringify header
         *
         * @param date
         * @return {string}
         */
        stringifyHeader(date) {
            const d = this.siblingsMonth(date);
            return this.text.months[d.getMonth()] + ' ' + d.getFullYear();
        },
        /**
         * Return i18n month name
         *
         * @param date
         * @return {string}
         */
        parseMonth(date) {
            return this.text.months[date.getMonth()];
        },
        /**
         * Return is value a Date
         *
         * @param value
         * @return {boolean}
         */
        isDate(value) {
            return !!(value && value.getFullYear);
        },
        /**
         * Stringify date to ISO string
         *
         * @param date
         * @return {string}
         */
        stringify(date) {
            if (!date) date = this.parse(this.inputValue);
            if (!date) return '';
            return date.toISOString();
        },
        /**
         * Parse string to Date
         *
         * @param str typeof string || Date
         * @param safe - return current Date if str is not a valid date
         * @return {*}
         */
        parse(str, safe = true) {
            if (typeof str == 'string') {
                return isNaN(+new Date(str))
                    ? safe
                        ? new Date()
                        : str
                    : new Date(str);
            } else {
                return str;
            }
        },
        /**
         * Get last date in month
         *
         * @param year
         * @param month
         * @return {number}
         */
        getDayCount(year, month) {
            const dict = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (month === 1) {
                if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
                    return 29;
                }
            }
            return dict[month];
        },
        /**
         * Return the index if the first day in the week
         *
         * @param date
         * @return {number}
         */
        prefixLen(date) {
            const firstDay = this.firstDayOfWeek;
            const wkday = date.getDay(); // first Date
            return wkday >= firstDay ? wkday - firstDay : 7 - firstDay + wkday;
        },
        /**
         * Get date range for visualization
         */
        getDateRange() {
            this.dateRange = [];
            this.decadeRange = [];
            let currMonth = this.siblingsMonth(this.currDate);
            let time = {
                year: currMonth.getFullYear(),
                month: currMonth.getMonth()
            };
            let yearStr = time.year.toString();
            let firstYearOfDecade =
                yearStr.substring(0, yearStr.length - 1) + 0 - 1;
            for (let i = 0; i < 12; i++) {
                this.decadeRange.push({
                    text: firstYearOfDecade + i
                });
            }
            const currMonthFirstDay = new Date(time.year, time.month, 1);
            let firstDayWeek = this.prefixLen(currMonthFirstDay);
            const dayCount = this.getDayCount(time.year, time.month);
            if (firstDayWeek >= 1) {
                const preMonth = this.getYearMonth(time.year, time.month - 1);
                const prevMonthDayCount = this.getDayCount(
                    preMonth.year,
                    preMonth.month
                );
                for (let i = 0; i < firstDayWeek; i++) {
                    const dayText = prevMonthDayCount - firstDayWeek + i + 1;
                    this.dateRange.push({
                        text: dayText,
                        date: new Date(preMonth.year, preMonth.month, dayText),
                        sclass: 'calendar-cell-gray'
                    });
                }
            }
            for (let i = 1; i <= dayCount; i++) {
                const date = new Date(time.year, time.month, i);
                const week = date.getDay();
                let sclass = '';
                this.disabledDaysOfWeek.forEach(el => {
                    if (week === parseInt(el, 10))
                        sclass = 'calendar-cell-disabled';
                });
                if (i === this.currDate.getDate()) {
                    if (this.inputValue) {
                        const valueDate = this.parse(this.inputValue);
                        if (valueDate) {
                            if (
                                valueDate.getFullYear() === time.year &&
                                valueDate.getMonth() === time.month
                            ) {
                                sclass = 'calendar-cell-active';
                            }
                        }
                    }
                }
                this.dateRange.push({
                    text: i,
                    date: date,
                    sclass: sclass
                });
            }
            if (this.dateRange.length < 42) {
                const nextMonthNeed = 42 - this.dateRange.length;
                const nextMonth = this.getYearMonth(time.year, time.month + 1);
                for (let i = 1; i <= nextMonthNeed; i++) {
                    this.dateRange.push({
                        text: i,
                        date: new Date(nextMonth.year, nextMonth.month, i),
                        sclass: 'calendar-cell-gray'
                    });
                }
            }
        }
    }
};
</script>

<style lang="scss">
@mixin clearfix {
    &:before,
    &:after {
        content: ' ';
        display: table;
    }
    &:after {
        clear: both;
    }
}
.calendar {
    display: block;
    user-select: none;
    margin: 3em auto;

    .calendar-wrapper {
        @include clearfix;
    }

    .calendar-ctrl {
        display: flex;
        justify-content: space-between;
        width: 200px;
        margin: 0 auto;

        .calendar-ctrl-header {
            color: #324049;
        }

        .calendar-ctrl-btn {
            cursor: pointer;
            width: 15px;
            height: 20px;
            padding: 0 15px;
            background: center no-repeat;
            background-size: 25%;

            &.angle-left {
                background-image: url('data:image/svg+xml;base64,PHN2ZyBpZD0idGVzdCIgd2lkdGg9IjEwcHgiIGhlaWdodD0iMThweCIgdmlld0JveD0iMCAwIDEwIDE4IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPGcgaWQ9IldlYi1EZXNpZ24iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+CiAgICAgICAgPGcgaWQ9IlNlbGVjdC1UaWNrZXRzLU5ldyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTMzMi4wMDAwMDAsIC0yMDU5LjAwMDAwMCkiIHN0cm9rZT0iI0UxNTU3NyIgc3Ryb2tlLXdpZHRoPSIzIj4KICAgICAgICAgICAgPGcgaWQ9IkNhbGVuZGFyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNjUuMDAwMDAwLCAxOTgxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IkNhbGVuZGFyLUhlYWRlciIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTY5LjAwMDAwMCwgNzYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIGlkPSJsZWZ0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzLjAwMDAwMCwgMTEuMDAwMDAwKSBzY2FsZSgxLCAtMSkgcm90YXRlKC05MC4wMDAwMDApIHRyYW5zbGF0ZSgtMy4wMDAwMDAsIC0xMS4wMDAwMDApICIgcG9pbnRzPSItNCAxNCAzIDggMyA4IDEwIDE0Ii8+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==');
            }
            &.angle-right {
                background-image: url('data:image/svg+xml;base64,PHN2ZyBpZD0idGVzdCIgd2lkdGg9IjEwcHgiIGhlaWdodD0iMThweCIgdmlld0JveD0iMCAwIDEwIDE4IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPGcgaWQ9IldlYi1EZXNpZ24iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+CiAgICAgICAgPGcgaWQ9IlNlbGVjdC1UaWNrZXRzLU5ldyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTUzOS4wMDAwMDAsIC0yMDU5LjAwMDAwMCkiIHN0cm9rZT0iI0UxNTU3NyIgc3Ryb2tlLXdpZHRoPSIzIj4KICAgICAgICAgICAgPGcgaWQ9IkNhbGVuZGFyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNjUuMDAwMDAwLCAxOTgxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IkNhbGVuZGFyLUhlYWRlciIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTY5LjAwMDAwMCwgNzYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIGlkPSJyaWdodCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjEwLjAwMDAwMCwgMTEuMDAwMDAwKSBzY2FsZSgxLCAtMSkgcm90YXRlKC0yNzAuMDAwMDAwKSB0cmFuc2xhdGUoLTIxMC4wMDAwMDAsIC0xMS4wMDAwMDApICIgcG9pbnRzPSIyMDMgMTQgMjEwIDggMjE3IDE0Ii8+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==');
            }
        }
    }

    .calendar-body {
        .calendar-weekRange {
            display: flex;
            font-weight: bold;

            .calendar-cell {
                color: #b8bfc6;
                width: 100%;
                padding: 15px;
                text-align: center;
            }
        }

        .calendar-dateRange {
            @include clearfix;

            .calendar-cell {
                float: left;
                position: relative;
                text-align: center;
                color: #324049;
                cursor: pointer;
                border-radius: 2px;
                border: 2px solid transparent;
                margin: -1px;
                padding: 12px;

                .date {
                    font-weight: 500;
                }

                .inform {
                    font-size: 0.75em;
                    height: 16px;
                }

                &:not(.calendar-cell-disabled):hover {
                    border-color: #f7f5f5;
                }

                &.calendar-cell-gray {
                    color: #d9d9d9;
                    span {
                        color: #d9d9d9 !important;
                    }
                }

                &.calendar-cell-disabled {
                    cursor: not-allowed;
                    text-decoration: line-through;
                    color: #d9d9d9;
                }

                &.calendar-cell-active {
                    border-color: #f7f5f5;
                    &:after {
                        content: ' ';
                        position: absolute;
                        top: -10px;
                        right: -10px;
                        width: 26px;
                        height: 26px;
                        z-index: 1;
                        background: url('data:image/svg+xml;base64,PHN2ZyBpZD0idGVzdCIgd2lkdGg9IjI2cHgiIGhlaWdodD0iMjZweCIgdmlld0JveD0iMCAwIDI2IDI2IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPGRlZnM+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiIGlkPSJsaW5lYXJHcmFkaWVudC0xIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzY5QTBDNSIgb2Zmc2V0PSIwJSIvPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjNUJFNUM0IiBvZmZzZXQ9IjEwMCUiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgogICAgPGcgaWQ9IldlYi1EZXNpZ24iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJTZWxlY3QtVGlja2V0cy1OZXciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zNzYuMDAwMDAwLCAtMjMzMC4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IkNhbGVuZGFyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNjUuMDAwMDAwLCAxOTgxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Im51bWJlcnMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2LjAwMDAwMCwgMTgwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJjaGVjayIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTg1LjAwMDAwMCwgMTY5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsIiBmaWxsPSJ1cmwoI2xpbmVhckdyYWRpZW50LTEpIiBjeD0iMTMiIGN5PSIxMyIgcj0iMTMiLz4KICAgICAgICAgICAgICAgICAgICAgICAgPHBvbHlsaW5lIGlkPSJQYXRoLTIiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHBvaW50cz0iOCAxMy41IDExIDE3IDE3IDkiLz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==');
                    }
                }
            }
        }
    }
}
</style>
