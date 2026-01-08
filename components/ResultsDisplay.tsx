'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ProcessedData, Transaction } from '@/types';

interface ResultsDisplayProps {
  data: ProcessedData;
  processingTime: number | null;
  onReset: () => void;
}

const SERVICE_ICONS: Record<string, string> = {
  'Netflix': 'N',
  'Spotify': 'S',
  'PlayStation': 'PS',
  'Discord': 'D',
  'ChatGPT Plus': 'GPT',
  'Replit': 'R',
  'Supabase': 'S',
  'Railway': '🚂',
};

const SERVICE_COLORS: Record<string, string> = {
  'Netflix': 'bg-red-500',
  'Spotify': 'bg-green-500',
  'PlayStation': 'bg-blue-500',
  'Discord': 'bg-indigo-500',
  'ChatGPT Plus': 'bg-green-600',
  'Replit': 'bg-orange-500',
  'Supabase': 'bg-green-400',
  'Railway': 'bg-gray-600',
};

// Category colors - hex values for charts and text colors for titles
const CATEGORY_COLORS: Record<string, { hex: string; text: string }> = {
  'Streaming': { hex: '#ef4444', text: 'text-red-500' },
  'Food': { hex: '#f59e0b', text: 'text-amber-500' },
  'Gaming': { hex: '#ef4444', text: 'text-red-500' },
  'Software': { hex: '#8b5cf6', text: 'text-purple-500' },
  'Cloud Services': { hex: '#06b6d4', text: 'text-cyan-500' },
  'Productivity': { hex: '#10b981', text: 'text-emerald-500' },
  'AI Tools': { hex: '#ec4899', text: 'text-pink-500' },
  'Development': { hex: '#f97316', text: 'text-orange-500' },
  'Communication': { hex: '#6366f1', text: 'text-indigo-500' },
  'Crypto': { hex: '#3b82f6', text: 'text-blue-500' },
  'Other': { hex: '#6b7280', text: 'text-gray-500' },
  'Income': { hex: '#22c55e', text: 'text-green-500' },
};

// Fallback colors for unknown categories
const FALLBACK_COLORS = [
  { hex: '#ef4444', text: 'text-red-500' },
  { hex: '#f59e0b', text: 'text-amber-500' },
  { hex: '#3b82f6', text: 'text-blue-500' },
  { hex: '#8b5cf6', text: 'text-purple-500' },
  { hex: '#06b6d4', text: 'text-cyan-500' },
  { hex: '#10b981', text: 'text-emerald-500' },
  { hex: '#ec4899', text: 'text-pink-500' },
  { hex: '#f97316', text: 'text-orange-500' },
  { hex: '#6366f1', text: 'text-indigo-500' },
  { hex: '#eab308', text: 'text-yellow-500' },
  { hex: '#6b7280', text: 'text-gray-500' },
  { hex: '#22c55e', text: 'text-green-500' },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function truncateDescription(description: string): { text: string; isTruncated: boolean } {
  let spaceCount = 0;
  let truncateIndex = -1;

  for (let i = 0; i < description.length; i++) {
    if (description[i] === ' ') {
      spaceCount++;
      if (spaceCount === 2) {
        truncateIndex = i;
        break;
      }
    }
  }

  if (truncateIndex !== -1) {
    return { text: description.substring(0, truncateIndex), isTruncated: true };
  }

  return { text: description, isTruncated: false };
}

export default function ResultsDisplay({ data, processingTime, onReset }: ResultsDisplayProps) {
  const visibleServices = data.services.slice(0, 7);
  const remainingCount = Math.max(0, data.services.length - 7);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [categoryChartTypes, setCategoryChartTypes] = useState<Record<string, 'line' | 'bar'>>({});

  // Get color for a category, with fallback for unknown categories
  const getCategoryColor = (category: string, categoryIndex: number) => {
    if (CATEGORY_COLORS[category]) {
      return CATEGORY_COLORS[category];
    }
    // Use modulo to cycle through fallback colors for unknown categories
    return FALLBACK_COLORS[categoryIndex % FALLBACK_COLORS.length];
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const setCategoryChartType = (category: string, type: 'line' | 'bar') => {
    setCategoryChartTypes((prev) => ({
      ...prev,
      [category]: type,
    }));
  };

  const getCategoryChartType = (category: string): 'line' | 'bar' => {
    return categoryChartTypes[category] || 'line';
  };

  // Parse date from "MM/DD" format and convert to sortable date
  const parseDate = (dateStr: string): Date => {
    const [month, day] = dateStr.split('/').map(Number);
    const currentYear = new Date().getFullYear();
    return new Date(currentYear, month - 1, day);
  };

  // Process data for charts
  const { lineChartData, barChartData } = useMemo(() => {
    if (!data.transactions || data.transactions.length === 0) {
      return { lineChartData: [], barChartData: [] };
    }

    // Sort transactions by date
    const sortedTransactions = [...data.transactions].sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    // For bar chart: group by date and sum amounts per day (non-compounding)
    const dailyTotals: Record<string, number> = {};
    sortedTransactions.forEach((transaction) => {
      const dateKey = transaction.date;
      if (!dailyTotals[dateKey]) {
        dailyTotals[dateKey] = 0;
      }
      // Use absolute value since amounts are negative for expenses
      dailyTotals[dateKey] += Math.abs(transaction.amount);
    });

    // For line chart: calculate cumulative totals
    let cumulativeTotal = 0;
    const lineData = sortedTransactions.map((transaction) => {
      cumulativeTotal += Math.abs(transaction.amount);
      return {
        date: transaction.date,
        cumulative: cumulativeTotal,
      };
    });

    // For bar chart: convert daily totals to array format
    const barData = Object.entries(dailyTotals)
      .map(([date, amount]) => ({
        date,
        daily: amount,
      }))
      .sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateA.getTime() - dateB.getTime();
      });

    return { lineChartData: lineData, barChartData: barData };
  }, [data.transactions]);

  const chartData = chartType === 'line' ? lineChartData : barChartData;

  // Helper function to process chart data for a specific category
  const getCategoryChartData = (transactions: Transaction[]) => {
    if (!transactions || transactions.length === 0) {
      return { lineChartData: [], barChartData: [] };
    }

    // Sort transactions by date
    const sortedTransactions = [...transactions].sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    // For bar chart: group by date and sum amounts per day (non-compounding)
    const dailyTotals: Record<string, number> = {};
    sortedTransactions.forEach((transaction) => {
      const dateKey = transaction.date;
      if (!dailyTotals[dateKey]) {
        dailyTotals[dateKey] = 0;
      }
      dailyTotals[dateKey] += Math.abs(transaction.amount);
    });

    // For line chart: calculate cumulative totals
    let cumulativeTotal = 0;
    const lineData = sortedTransactions.map((transaction) => {
      cumulativeTotal += Math.abs(transaction.amount);
      return {
        date: transaction.date,
        cumulative: cumulativeTotal,
      };
    });

    // For bar chart: convert daily totals to array format
    const barData = Object.entries(dailyTotals)
      .map(([date, amount]) => ({
        date,
        daily: amount,
      }))
      .sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateA.getTime() - dateB.getTime();
      });

    return { lineChartData: lineData, barChartData: barData };
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="text-sm font-medium text-gray-800">{`Date: ${data.date}`}</p>
          {chartType === 'line' ? (
            <p className="text-sm text-blue-600">{`Cumulative: ${formatCurrency(data.cumulative)}`}</p>
          ) : (
            <p className="text-sm text-green-600">{`Daily: ${formatCurrency(data.daily)}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const CategoryTooltip = ({ active, payload, chartType: tooltipChartType }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="text-sm font-medium text-gray-800">{`Date: ${data.date}`}</p>
          {tooltipChartType === 'line' ? (
            <p className="text-sm text-blue-600">{`Cumulative: ${formatCurrency(data.cumulative)}`}</p>
          ) : (
            <p className="text-sm text-green-600">{`Daily: ${formatCurrency(data.daily)}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-white">
        {/* Header with total */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            {formatCurrency(data.total)}
          </h1>
          <p className="text-gray-600 text-lg">this month&apos;s spending</p>
        </div>

        {/* Service tags */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {remainingCount > 0 && (
            <div className="px-4 py-1.5 bg-gray-200 rounded-full text-sm font-medium text-gray-700">
              +{remainingCount}
            </div>
          )}
          {visibleServices.map((service) => (
            <div
              key={service}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium text-blue-500
                flex items-center gap-1.5
                ${SERVICE_COLORS[service] || 'border border-gray-500'}
              `}
            >
              {SERVICE_ICONS[service] && (
                <span className="text-xs font-bold leading-none">{SERVICE_ICONS[service]}</span>
              )}
              <span>{service}</span>
            </div>
          ))}
        </div>

        {/* Processing status */}
        <div className="flex items-center justify-center gap-2 text-gray-600 mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm">Analyzed {data.numberOfTransactions} transactions in {processingTime?.toFixed(1) || '0.0'}s</span>
        </div>

        {/* Chart section */}
        {chartData.length > 0 && (
          <div className="mt-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Transaction Timeline</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${chartType === 'line'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${chartType === 'bar'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  Bar
                </button>
              </div>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                      tickFormatter={(value) => `$${value.toFixed(0)}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                      tickFormatter={(value) => `$${value.toFixed(0)}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="daily" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Categories section */}
        <div className="mt-8 space-y-6">
          {Object.entries(data.categories).map(([category, transactions], categoryIndex) => {
            const isExpanded = expandedCategories.has(category);
            const visibleTransactions = isExpanded
              ? transactions
              : transactions.slice(0, 5);
            const remainingCount = transactions.length - 5;
            const categoryChartData = getCategoryChartData(transactions);
            const categoryColor = getCategoryColor(category, categoryIndex);

            const categoryChartType = getCategoryChartType(category);
            const categoryChartForType = categoryChartType === 'line' ? categoryChartData.lineChartData : categoryChartData.barChartData;

            return (
              <div key={category} className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-semibold ${categoryColor.text}`}>{category}</h3>
                  {categoryChartForType.length > 0 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCategoryChartType(category, 'line')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${categoryChartType === 'line'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                      >
                        Line
                      </button>
                      <button
                        onClick={() => setCategoryChartType(category, 'bar')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${categoryChartType === 'bar'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                      >
                        Bar
                      </button>
                    </div>
                  )}
                </div>

                {/* Category chart */}
                {categoryChartForType.length > 0 && (
                  <div className="mb-4">
                    <div className="w-full h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        {categoryChartType === 'line' ? (
                          <LineChart data={categoryChartForType}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                              dataKey="date"
                              stroke="#6b7280"
                              fontSize={10}
                              tick={{ fill: '#6b7280' }}
                            />
                            <YAxis
                              stroke="#6b7280"
                              fontSize={10}
                              tick={{ fill: '#6b7280' }}
                              tickFormatter={(value) => `$${value.toFixed(0)}`}
                            />
                            <Tooltip content={<CategoryTooltip chartType={categoryChartType} />} />
                            <Line
                              type="monotone"
                              dataKey="cumulative"
                              stroke={categoryColor.hex}
                              strokeWidth={2}
                              dot={{ fill: categoryColor.hex, r: 2 }}
                              activeDot={{ r: 4 }}
                            />
                          </LineChart>
                        ) : (
                          <BarChart data={categoryChartForType}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                              dataKey="date"
                              stroke="#6b7280"
                              fontSize={10}
                              tick={{ fill: '#6b7280' }}
                            />
                            <YAxis
                              stroke="#6b7280"
                              fontSize={10}
                              tick={{ fill: '#6b7280' }}
                              tickFormatter={(value) => `$${value.toFixed(0)}`}
                            />
                            <Tooltip content={<CategoryTooltip chartType={categoryChartType} />} />
                            <Bar dataKey="daily" fill={categoryColor.hex} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                <div className="space-y-0">
                  {visibleTransactions.map((transaction, idx) => {
                    const isNegative = transaction.amount < 0;
                    const amountColor = isNegative
                      ? data.accountType === 'credit'
                        ? 'text-green-500'
                        : 'text-red-500'
                      : data.accountType === 'credit' ? 'text-red-500' : 'text-green-500';

                    const descriptionKey = `${category}-${idx}-${transaction.description}`;
                    const isDescriptionExpanded = expandedDescriptions.has(descriptionKey);
                    const { text: truncatedText, isTruncated } = truncateDescription(transaction.description);
                    const displayText = isDescriptionExpanded ? transaction.description : truncatedText;

                    return (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-sm text-gray-600 py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <span className="flex-1 flex items-center gap-1">
                          <span className={isDescriptionExpanded ? '' : 'truncate'}>{displayText}</span>
                          {isTruncated && !isDescriptionExpanded && (
                            <button
                              onClick={() => {
                                const newExpanded = new Set(expandedDescriptions);
                                newExpanded.add(descriptionKey);
                                setExpandedDescriptions(newExpanded);
                              }}
                              className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex-shrink-0"
                            >
                              (show)
                            </button>
                          )}
                        </span>
                        <span className={`ml-4 font-medium flex-shrink-0 ${amountColor}`}>
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    );
                  })}
                  {transactions.length > 5 && (
                    <button
                      onClick={() => toggleCategory(category)}
                      className="text-xs text-blue-500 hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                    >
                      {isExpanded
                        ? 'Show less'
                        : `+${remainingCount} more`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Privacy message */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-50 px-4 py-2 rounded">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Your files are never stored</span>
          </div>
        </div>
      </div>

      {/* Reset button */}
      <div className="mt-6 text-center">
        <button
          onClick={onReset}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Analyze Another File
        </button>
      </div>
    </div>
  );
}

