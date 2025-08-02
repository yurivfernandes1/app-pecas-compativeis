import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Title, Button, Card, colors } from '../styles/GlobalStyles';
import { logger, type LogEntry, type TestResult, type SystemHealth } from '../utils/logger';
import { appTester, healthChecker } from '../utils/testing';

const PageWrapper = styled.div`
  background: ${colors.background};
  min-height: 100vh;
  padding: 2rem 0;
`;

const DiagnosticCard = styled(Card)`
  margin-bottom: 1.5rem;
  background: ${colors.surface};
  border: 1px solid ${colors.gray[800]};
`;

const SectionTitle = styled.h2`
  color: ${colors.primary};
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid ${colors.primary};
  padding-bottom: 0.5rem;
`;

const StatusBadge = styled.span<{ status: 'healthy' | 'warning' | 'error' | 'passed' | 'failed' | 'skipped' }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.status) {
      case 'healthy':
      case 'passed':
        return `
          background: #1f3937;
          color: #4ade80;
          border: 1px solid #166534;
        `;
      case 'warning':
        return `
          background: #3f2f1e;
          color: #fbbf24;
          border: 1px solid #92400e;
        `;
      case 'error':
      case 'failed':
        return `
          background: ${colors.red[900]};
          color: ${colors.red[300]};
          border: 1px solid ${colors.red[700]};
        `;
      case 'skipped':
        return `
          background: ${colors.gray[800]};
          color: ${colors.gray[300]};
          border: 1px solid ${colors.gray[700]};
        `;
      default:
        return `
          background: ${colors.gray[800]};
          color: ${colors.gray[300]};
          border: 1px solid ${colors.gray[700]};
        `;
    }
  }}
`;

const LogLevel = styled.span<{ level: 'info' | 'warn' | 'error' | 'debug' }>`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-right: 0.5rem;
  
  ${props => {
    switch (props.level) {
      case 'info':
        return `
          background: #1e3a8a;
          color: #60a5fa;
        `;
      case 'warn':
        return `
          background: #3f2f1e;
          color: #fbbf24;
        `;
      case 'error':
        return `
          background: ${colors.red[900]};
          color: ${colors.red[300]};
        `;
      case 'debug':
        return `
          background: #2d1b69;
          color: #c084fc;
        `;
      default:
        return `
          background: ${colors.gray[800]};
          color: ${colors.gray[300]};
        `;
    }
  }}
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const MetricCard = styled.div`
  background: ${colors.gray[800]};
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${colors.gray[700]};
  text-align: center;
  
  .metric-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${colors.primary};
    display: block;
    margin-bottom: 0.25rem;
  }
  
  .metric-label {
    color: ${colors.gray[300]};
    font-size: 0.875rem;
  }
`;

const LogEntryComponent = styled.div`
  background: ${colors.gray[800]};
  border: 1px solid ${colors.gray[700]};
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  
  .log-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .log-timestamp {
    color: ${colors.gray[400]};
    font-size: 0.75rem;
    margin-left: auto;
  }
  
  .log-component {
    color: #60a5fa;
    font-weight: 600;
    margin-left: 0.5rem;
  }
  
  .log-message {
    color: ${colors.gray[200]};
    line-height: 1.4;
  }
  
  .log-data {
    background: ${colors.gray[900]};
    border: 1px solid ${colors.gray[600]};
    border-radius: 4px;
    padding: 0.5rem;
    margin-top: 0.5rem;
    white-space: pre-wrap;
    overflow-x: auto;
    font-size: 0.75rem;
    color: ${colors.gray[300]};
  }
`;

const TestResultItem = styled.div`
  background: ${colors.gray[800]};
  border: 1px solid ${colors.gray[700]};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  
  .test-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .test-name {
    font-weight: 600;
    color: ${colors.gray[200]};
  }
  
  .test-duration {
    color: ${colors.gray[400]};
    font-size: 0.875rem;
  }
  
  .test-error {
    background: ${colors.red[900]};
    border: 1px solid ${colors.red[700]};
    border-radius: 4px;
    padding: 0.5rem;
    margin-top: 0.5rem;
    color: ${colors.red[200]};
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const TabGroup = styled.div`
  display: flex;
  border-bottom: 2px solid ${colors.gray[700]};
  margin-bottom: 1rem;
`;

const Tab = styled.button<{ active: boolean }>`
  background: ${props => props.active ? colors.primary : 'transparent'};
  color: ${props => props.active ? colors.white : colors.gray[300]};
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
  border-radius: 8px 8px 0 0;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? colors.primary : colors.gray[800]};
    color: ${colors.white};
  }
`;

const ScrollableContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid ${colors.gray[700]};
  border-radius: 8px;
  padding: 1rem;
  background: ${colors.gray[900]};
`;

const Diagnosticos: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'logs' | 'health'>('overview');
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warn' | 'error' | 'debug'>('all');

  useEffect(() => {
    // Carregar dados iniciais
    loadLogs();
    checkSystemHealth();
    
    // Log que a página foi acessada
    logger.info('Página de diagnósticos acessada', 'Diagnosticos');
  }, []);

  const loadLogs = () => {
    const allLogs = logger.getLogs();
    setLogs(allLogs);
  };

  const runTests = async () => {
    setIsRunningTests(true);
    logger.info('Iniciando execução de testes', 'Diagnosticos');
    
    try {
      const results = await appTester.runAllTests();
      setTestResults(results);
      
      const summary = appTester.getTestRunner().getSummary();
      logger.info(
        `Testes concluídos: ${summary.passed}/${summary.total} passou`, 
        'Diagnosticos',
        summary
      );
    } catch (error) {
      logger.error('Erro ao executar testes', 'Diagnosticos', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const checkSystemHealth = async () => {
    try {
      const health = await healthChecker.checkSystemHealth();
      setSystemHealth(health);
      
      logger.info(
        `Verificação de saúde concluída: ${health.status}`, 
        'Diagnosticos',
        health
      );
    } catch (error) {
      logger.error('Erro ao verificar saúde do sistema', 'Diagnosticos', error);
    }
  };

  const clearLogs = () => {
    logger.clearLogs();
    setLogs([]);
    logger.info('Logs limpos', 'Diagnosticos');
  };

  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      logs: logs.slice(0, 50), // Últimos 50 logs
      testResults,
      systemHealth
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnosticos-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    logger.info('Dados de diagnóstico exportados', 'Diagnosticos');
  };

  const filteredLogs = logFilter === 'all' ? logs : logs.filter(log => log.level === logFilter);

  const getTestSummary = () => {
    if (testResults.length === 0) return null;
    
    const passed = testResults.filter(t => t.status === 'passed').length;
    const failed = testResults.filter(t => t.status === 'failed').length;
    const total = testResults.length;
    
    return { passed, failed, total, passRate: (passed / total) * 100 };
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  return (
    <PageWrapper>
      <Container>
        <Title>Diagnósticos do Sistema</Title>
        <p style={{ color: colors.gray[300], marginBottom: '2rem' }}>
          Página interna de monitoramento e diagnóstico do aplicativo.
        </p>

        <ButtonGroup>
          <Button onClick={runTests} disabled={isRunningTests} variant="primary">
            {isRunningTests ? 'Executando Testes...' : 'Executar Todos os Testes'}
          </Button>
          <Button onClick={checkSystemHealth} variant="secondary">
            Verificar Saúde do Sistema
          </Button>
          <Button onClick={loadLogs} variant="secondary">
            Recarregar Logs
          </Button>
          <Button onClick={clearLogs} variant="secondary">
            Limpar Logs
          </Button>
          <Button onClick={exportData} variant="secondary">
            Exportar Dados
          </Button>
        </ButtonGroup>

        <TabGroup>
          <Tab 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </Tab>
          <Tab 
            active={activeTab === 'tests'} 
            onClick={() => setActiveTab('tests')}
          >
            Testes ({testResults.length})
          </Tab>
          <Tab 
            active={activeTab === 'logs'} 
            onClick={() => setActiveTab('logs')}
          >
            Logs ({logs.length})
          </Tab>
          <Tab 
            active={activeTab === 'health'} 
            onClick={() => setActiveTab('health')}
          >
            Saúde do Sistema
          </Tab>
        </TabGroup>

        {activeTab === 'overview' && (
          <>
            <DiagnosticCard>
              <SectionTitle>Resumo Geral</SectionTitle>
              <MetricGrid>
                <MetricCard>
                  <span className="metric-value">{logs.length}</span>
                  <span className="metric-label">Total de Logs</span>
                </MetricCard>
                <MetricCard>
                  <span className="metric-value">
                    {logs.filter(l => l.level === 'error').length}
                  </span>
                  <span className="metric-label">Erros</span>
                </MetricCard>
                <MetricCard>
                  <span className="metric-value">{testResults.length}</span>
                  <span className="metric-label">Testes Executados</span>
                </MetricCard>
                <MetricCard>
                  <span className="metric-value">
                    {systemHealth?.status || 'N/A'}
                  </span>
                  <span className="metric-label">Status do Sistema</span>
                </MetricCard>
              </MetricGrid>
            </DiagnosticCard>

            {getTestSummary() && (
              <DiagnosticCard>
                <SectionTitle>Último Resultado dos Testes</SectionTitle>
                <MetricGrid>
                  <MetricCard>
                    <span className="metric-value" style={{ color: '#4ade80' }}>
                      {getTestSummary()!.passed}
                    </span>
                    <span className="metric-label">Testes Passou</span>
                  </MetricCard>
                  <MetricCard>
                    <span className="metric-value" style={{ color: colors.red[400] }}>
                      {getTestSummary()!.failed}
                    </span>
                    <span className="metric-label">Testes Falhou</span>
                  </MetricCard>
                  <MetricCard>
                    <span className="metric-value">
                      {getTestSummary()!.passRate.toFixed(1)}%
                    </span>
                    <span className="metric-label">Taxa de Sucesso</span>
                  </MetricCard>
                  <MetricCard>
                    <span className="metric-value">
                      {getTestSummary()!.total}
                    </span>
                    <span className="metric-label">Total de Testes</span>
                  </MetricCard>
                </MetricGrid>
              </DiagnosticCard>
            )}
          </>
        )}

        {activeTab === 'tests' && (
          <DiagnosticCard>
            <SectionTitle>Resultados dos Testes</SectionTitle>
            {testResults.length === 0 ? (
              <p style={{ color: colors.gray[400] }}>
                Nenhum teste foi executado ainda. Clique em "Executar Todos os Testes" para começar.
              </p>
            ) : (
              <ScrollableContainer>
                {testResults.map((test) => (
                  <TestResultItem key={test.id}>
                    <div className="test-header">
                      <div>
                        <StatusBadge status={test.status}>{test.status}</StatusBadge>
                        <span className="test-name">{test.name}</span>
                      </div>
                      <span className="test-duration">
                        {formatDuration(test.duration)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: colors.gray[400] }}>
                      {formatTimestamp(test.timestamp)}
                    </div>
                    {test.error && (
                      <div className="test-error">
                        <strong>Erro:</strong> {test.error}
                        {test.details && (
                          <pre style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                            {test.details}
                          </pre>
                        )}
                      </div>
                    )}
                  </TestResultItem>
                ))}
              </ScrollableContainer>
            )}
          </DiagnosticCard>
        )}

        {activeTab === 'logs' && (
          <DiagnosticCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <SectionTitle>Logs do Sistema</SectionTitle>
              <select 
                value={logFilter} 
                onChange={(e) => setLogFilter(e.target.value as any)}
                style={{
                  background: colors.gray[800],
                  color: colors.gray[200],
                  border: `1px solid ${colors.gray[600]}`,
                  borderRadius: '4px',
                  padding: '0.5rem'
                }}
              >
                <option value="all">Todos os Níveis</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
                <option value="debug">Debug</option>
              </select>
            </div>
            
            {filteredLogs.length === 0 ? (
              <p style={{ color: colors.gray[400] }}>Nenhum log encontrado.</p>
            ) : (
              <ScrollableContainer>
                {filteredLogs.map((log) => (
                  <LogEntryComponent key={log.id}>
                    <div className="log-header">
                      <LogLevel level={log.level}>{log.level}</LogLevel>
                      {log.component && (
                        <span className="log-component">[{log.component}]</span>
                      )}
                      <span className="log-timestamp">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>
                    <div className="log-message">{log.message}</div>
                    {log.data && (
                      <div className="log-data">
                        {JSON.stringify(log.data, null, 2)}
                      </div>
                    )}
                  </LogEntryComponent>
                ))}
              </ScrollableContainer>
            )}
          </DiagnosticCard>
        )}

        {activeTab === 'health' && (
          <DiagnosticCard>
            <SectionTitle>Saúde do Sistema</SectionTitle>
            {systemHealth ? (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <StatusBadge status={systemHealth.status}>
                    {systemHealth.status}
                  </StatusBadge>
                  <span style={{ marginLeft: '1rem', color: colors.gray[400] }}>
                    Última verificação: {formatTimestamp(systemHealth.timestamp)}
                  </span>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ color: colors.gray[200], marginBottom: '1rem' }}>Performance</h3>
                  <MetricGrid>
                    <MetricCard>
                      <span className="metric-value">
                        {formatDuration(systemHealth.performance.loadTime)}
                      </span>
                      <span className="metric-label">Tempo de Carregamento</span>
                    </MetricCard>
                    <MetricCard>
                      <span className="metric-value">
                        {systemHealth.performance.memoryUsage ? 
                          `${(systemHealth.performance.memoryUsage / 1024 / 1024).toFixed(1)} MB` : 
                          'N/A'
                        }
                      </span>
                      <span className="metric-label">Uso de Memória</span>
                    </MetricCard>
                    <MetricCard>
                      <span className="metric-value">
                        {systemHealth.performance.networkStatus}
                      </span>
                      <span className="metric-label">Status da Rede</span>
                    </MetricCard>
                  </MetricGrid>
                </div>

                <div>
                  <h3 style={{ color: colors.gray[200], marginBottom: '1rem' }}>Verificações</h3>
                  {systemHealth.checks.map((check, index) => (
                    <TestResultItem key={index}>
                      <div className="test-header">
                        <div>
                          <StatusBadge status={check.status}>{check.status}</StatusBadge>
                          <span className="test-name">{check.name}</span>
                        </div>
                        <span className="test-duration">
                          {formatDuration(check.duration)}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.875rem', color: colors.gray[400] }}>
                        {check.message}
                      </div>
                    </TestResultItem>
                  ))}
                </div>
              </>
            ) : (
              <p style={{ color: colors.gray[400] }}>
                Nenhuma verificação de saúde foi executada ainda. Clique em "Verificar Saúde do Sistema".
              </p>
            )}
          </DiagnosticCard>
        )}
      </Container>
    </PageWrapper>
  );
};

export default Diagnosticos;
