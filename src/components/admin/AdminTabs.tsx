'use client'

import { useState, useMemo } from 'react'
import { ProfilesManagement } from './ProfilesManagement'
import { QuestionsManagement } from './QuestionsManagement'
import { QuestionMetadataManagement } from './QuestionMetadataManagement'
import { AdminActionsViewer } from './AdminActionsViewer'
import QuestionsImport from './QuestionsImport'
import DatabaseManager from '../DatabaseManager'

type TabType = 'profiles' | 'questions' | 'metadata' | 'actions' | 'database' | 'import'

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState<TabType>('profiles')

  const tabs = useMemo(() => [
    { id: 'profiles' as TabType, label: 'Perfis de Usuário', component: ProfilesManagement },
    { id: 'questions' as TabType, label: 'Questões', component: QuestionsManagement },
    { id: 'metadata' as TabType, label: 'Metadados', component: QuestionMetadataManagement },
    { id: 'actions' as TabType, label: 'Ações Admin', component: AdminActionsViewer },
    { id: 'database' as TabType, label: 'Banco de Dados', component: () => <DatabaseManager /> },
    { id: 'import' as TabType, label: 'Importar Questões', component: () => <QuestionsImport /> },
  ], [])

  const ActiveComponent = useMemo(() =>
    tabs.find(tab => tab.id === activeTab)?.component || ProfilesManagement,
    [tabs, activeTab]
  )

  return (
    <div>
      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        <ActiveComponent />
      </div>
    </div>
  )
}
