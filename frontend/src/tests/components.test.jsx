import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { ReportView } from '../components/ReportView.jsx';
import { ProfileWizard } from '../components/ProfileWizard.jsx';

// Mock VentureContext for ProfileWizard
vi.mock('../context/VentureContext.jsx', () => ({
  useVenture: () => ({
    activeVenture: {
      _id: 'v-123',
      name: 'PayFlow India',
      oneLiner: 'B2B UPI payouts',
      industry: 'Fintech',
      stage: 'Seed',
      team: { foundersCount: 2, headcount: 5, keyRoles: 'Dev' },
      financialSnapshot: { startingCash: 1000000, monthlyRevenue: 50000 },
    },
    updateActiveVenture: vi.fn(),
    sampleVenture: {
      name: 'Sample PayFlow',
      oneLiner: 'Sample payments',
    },
  }),
}));

describe('DOM Component Tests (Vitest + React Testing Library)', () => {
  const sampleVenture = {
    _id: 'v-123',
    name: 'PayFlow India',
    oneLiner: 'B2B UPI payouts',
    industry: 'Fintech',
  };

  const sampleScenario = {
    _id: 'sc-123',
    name: 'Base Scenario',
    data: { startingCash: 1000000 },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );
  });

  describe('ReportView DOM Component Tests', () => {
    test('renders initial state with report title, description, and mandatory disclaimer', async () => {
      render(
        <ReportView
          type="market"
          activeVenture={sampleVenture}
          activeScenario={sampleScenario}
          token="test-token"
        />
      );

      // Title & Header check
      expect(await screen.findByText('Market Intelligence')).toBeInTheDocument();
      expect(
        screen.getByText('TAM, SAM, SOM sizing with assumptions & trend signals')
      ).toBeInTheDocument();

      // Mandatory Disclaimer check
      expect(screen.getByText(/Mandatory Disclaimer:/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Burnly Intelligence reports are planning aids/i)
      ).toBeInTheDocument();
    });

    test('renders prompt to sign in when user token is missing', async () => {
      render(
        <ReportView
          type="market"
          activeVenture={sampleVenture}
          activeScenario={sampleScenario}
          token={null}
        />
      );

      expect(
        await screen.findByText(/Sign in to generate tailored AI intelligence reports/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Sign In to Generate Report/i)).toBeInTheDocument();
    });

    test('renders report content with provenance badges and grounding sources when report data is loaded', async () => {
      const mockReport = {
        _id: 'rep-1',
        type: 'market',
        model: 'gemini-1.5-flash',
        generatedAt: new Date().toISOString(),
        inputsHash: 'matching-hash',
        content: {
          summary: 'Market size analysis summary',
          tam: { value: '₹50,000 Cr', description: 'Total Addressable Market' },
          sam: { value: '₹7,500 Cr', description: 'Serviceable Market' },
          som: { value: '₹250 Cr', description: 'Obtainable Target' },
          trends: [
            {
              title: 'UPI Adoption Surge',
              description: 'Digital payments growing 45% YoY',
              provenance: 'Sourced',
            },
          ],
          opportunities: [
            {
              title: 'Cross-Border Payouts',
              description: 'Expansion to SEA market',
              provenance: 'Estimate',
            },
          ],
        },
        sources: [
          {
            title: 'NPCI UPI Statistics 2026',
            url: 'https://npci.org.in/stats',
            retrievalDate: '2026-10-01',
          },
        ],
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockReport]),
        })
      );

      render(
        <ReportView
          type="market"
          activeVenture={sampleVenture}
          activeScenario={sampleScenario}
          token="test-token"
        />
      );

      // Verify report content rendered
      expect(await screen.findByText('Market size analysis summary')).toBeInTheDocument();
      expect(screen.getByText('₹50,000 Cr')).toBeInTheDocument();
      expect(screen.getByText('UPI Adoption Surge')).toBeInTheDocument();

      // Provenance badges check
      expect(screen.getAllByText('Sourced').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Estimate').length).toBeGreaterThan(0);

      // Sources & Citations section
      expect(screen.getByText('Grounding Sources & Citations')).toBeInTheDocument();
      expect(screen.getByText('NPCI UPI Statistics 2026')).toBeInTheDocument();
      expect(screen.getByText(/Retrieved: 2026-10-01/i)).toBeInTheDocument();
    });

    test('shows stale warning banner when financial inputs hash does not match report hash', async () => {
      const mockStaleReport = {
        _id: 'rep-2',
        type: 'market',
        model: 'gemini-1.5-flash',
        generatedAt: new Date().toISOString(),
        inputsHash: 'old-outdated-hash',
        content: { summary: 'Outdated report content' },
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockStaleReport]),
        })
      );

      render(
        <ReportView
          type="market"
          activeVenture={sampleVenture}
          activeScenario={sampleScenario}
          token="test-token"
        />
      );

      expect(
        await screen.findByText(/Financial inputs or profile data changed!/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Update Report/i)).toBeInTheDocument();
    });
  });

  describe('ProfileWizard DOM Component Tests', () => {
    test('renders Step 01 Business Overview by default', () => {
      render(<ProfileWizard />);

      expect(screen.getByText('Startup Profile & Intake Wizard')).toBeInTheDocument();
      expect(screen.getByText('1. Business Overview')).toBeInTheDocument();
      expect(screen.getByDisplayValue('PayFlow India')).toBeInTheDocument();
    });

    test('navigates through steps 1, 2, 3, 4 via step indicators', () => {
      render(<ProfileWizard />);

      // Click Step 02 Team
      fireEvent.click(screen.getByText('Team'));
      expect(screen.getByText('2. Team & Key Roles')).toBeInTheDocument();

      // Click Step 03 Financial Snapshot
      fireEvent.click(screen.getByText('Financial Snapshot'));
      expect(screen.getByText('3. Baseline Financial Snapshot')).toBeInTheDocument();

      // Click Step 04 Revenue Details
      fireEvent.click(screen.getByText('Revenue Details'));
      expect(screen.getByText('4. Revenue Model Details (Optional)')).toBeInTheDocument();
    });
  });
});
