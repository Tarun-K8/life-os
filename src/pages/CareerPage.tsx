import React, { useState } from 'react';
import {
  Code2,
  Clock,
  Briefcase,
  FolderGit2,
  AlertTriangle,
  Plus,
  ExternalLink,
  Trash2,
  Edit3,
  CheckCircle2,
  Filter,
  BarChart2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useLifeOs } from '../context/LifeOsContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { StudyBarChart } from '../components/common/Charts';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import {
  getTodayString,
  getCurrentWeekDates,
  getPastDates,
  formatDisplayDate,
} from '../utils/dateUtils';
import {
  DsaProblem,
  PlacementApplication,
  StrugglingTopic,
  ProjectItem,
  Difficulty,
  ProblemStatus,
  Platform,
  DsaTopic,
  ApplicationStage,
} from '../types';

export const CareerPage: React.FC = () => {
  const {
    data,
    setQuickAddOpen,
    deleteDsaProblem,
    deleteStudySession,
    addStrugglingTopic,
    editStrugglingTopic,
    deleteStrugglingTopic,
    addPlacement,
    editPlacement,
    deletePlacement,
    addProject,
    editProject,
    deleteProject,
    toggleProjectMilestone,
  } = useLifeOs();

  const todayStr = getTodayString();
  const [subTab, setSubTab] = useState<'dsa' | 'study' | 'struggling' | 'placements' | 'projects'>('dsa');

  // Filter states for DSA
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [placementModalOpen, setPlacementModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  // Form states for Struggling Topics
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('DSA');
  const [newTopicIssues, setNewTopicIssues] = useState('');
  const [newTopicConfidence, setNewTopicConfidence] = useState<number>(2);

  // Form states for Placement
  const [compName, setCompName] = useState('');
  const [compRole, setCompRole] = useState('SDE-1');
  const [compStage, setCompStage] = useState<ApplicationStage>('Applied');
  const [compDeadline, setCompDeadline] = useState('');
  const [compLocation, setCompLocation] = useState('');
  const [compPriority, setCompPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [compNotes, setCompNotes] = useState('');

  // Form states for Project
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('Go, Redis, Docker');
  const [projMilestonesText, setProjMilestonesText] = useState('Architecture design\nCore worker loop\nIntegration tests');

  // Study hours computation (past 7 days)
  const past7Dates = getPastDates(7, todayStr);
  const studyChartData = past7Dates.map(date => {
    const daySessions = data.studySessions.filter(s => s.date === date);
    const totalMinutes = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    return {
      label: date.split('-').slice(1).join('/'),
      value: Number((totalMinutes / 60).toFixed(1)),
      highlight: date === todayStr,
    };
  });

  // Filtered DSA problems
  const filteredProblems = data.dsaProblems.filter(p => {
    if (difficultyFilter !== 'all' && p.difficulty !== difficultyFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Metrics
  const independentSolves = data.dsaProblems.filter(p => p.status === 'Solved Independently').length;
  const withEditorialSolves = data.dsaProblems.filter(p => p.status === 'Solved with Hints / Editorial').length;
  const needsReviewCount = data.dsaProblems.filter(p => p.revisitNeeded || p.status === 'Attempted / Review Needed').length;

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;
    addStrugglingTopic({
      name: newTopicName.trim(),
      category: newTopicCategory,
      confidenceLevel: newTopicConfidence as any,
      status: 'Needs Revision',
      keyIssues: newTopicIssues.trim() || undefined,
    });
    setNewTopicName('');
    setNewTopicIssues('');
    setTopicModalOpen(false);
  };

  const handleAddPlacement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) return;
    addPlacement({
      company: compName.trim(),
      role: compRole.trim(),
      stage: compStage,
      appliedDate: todayStr,
      deadline: compDeadline || undefined,
      location: compLocation.trim() || undefined,
      priority: compPriority,
      notes: compNotes.trim() || undefined,
    });
    setCompName('');
    setCompNotes('');
    setPlacementModalOpen(false);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) return;
    const ms = projMilestonesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map((title, i) => ({ id: `m-${Date.now()}-${i}`, title, completed: false }));

    addProject({
      title: projTitle.trim(),
      description: projDesc.trim(),
      techStack: projTech.split(',').map(s => s.trim()).filter(Boolean),
      progressPercentage: 0,
      milestones: ms,
      status: 'In Progress',
    });
    setProjTitle('');
    setProjDesc('');
    setProjectModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Title & Navigation tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Career, DSA & Placement Command
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Track independent problem solving, placement pipeline, core engineering projects, and difficult topics with rigorous honesty.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuickAddOpen(true, 'dsa')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Log DSA Solve</span>
          </button>
          <button
            onClick={() => setQuickAddOpen(true, 'study')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Log Study Time</span>
          </button>
        </div>
      </div>

      {/* Honest Metric Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#111522] border border-[#1f263d] rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Independent Solves</span>
            <Badge variant="purple" size="sm">Pure Solve</Badge>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
            {independentSolves}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Zero editorial / hint lookups</p>
        </div>

        <div className="bg-[#111522] border border-[#1f263d] rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Editorial / Hint Solves</span>
            <Badge variant="warning" size="sm">Assisted</Badge>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {withEditorialSolves}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Learned pattern; needs re-solve</p>
        </div>

        <div className="bg-[#111522] border border-[#1f263d] rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Struggling Topics</span>
            <Badge variant="danger" size="sm">Revision</Badge>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
            {data.strugglingTopics.filter(t => t.status !== 'Mastered').length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Target for Saturday review</p>
        </div>

        <div className="bg-[#111522] border border-[#1f263d] rounded-xl p-3.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Placement Pipeline</span>
            <Badge variant="info" size="sm">Active</Badge>
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
            {data.placements.filter(p => !['Rejected', 'Withdrawn'].includes(p.stage)).length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Applications & interview stages</p>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-[#1f263d] pb-2 overflow-x-auto">
        {[
          { id: 'dsa', label: 'DSA Problem Journal', icon: Code2, count: data.dsaProblems.length },
          { id: 'study', label: 'Study Hours & Sessions', icon: Clock, count: data.studySessions.length },
          { id: 'struggling', label: 'Struggling Topics & Revision', icon: AlertTriangle, count: data.strugglingTopics.length },
          { id: 'placements', label: 'Placement Pipeline & OAs', icon: Briefcase, count: data.placements.length },
          { id: 'projects', label: 'Portfolio Projects', icon: FolderGit2, count: data.projects.length },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 1. DSA Problems Sub-Tab */}
      {subTab === 'dsa' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#111522] border border-[#1f263d] rounded-xl">
            <input
              type="text"
              placeholder="Search problem title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={difficultyFilter}
                onChange={e => setDifficultyFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
              >
                <option value="all">All Solve Types</option>
                <option value="Solved Independently">Independently Solved</option>
                <option value="Solved with Hints / Editorial">With Editorial</option>
                <option value="Attempted / Review Needed">Needs Review</option>
              </select>
            </div>
          </div>

          {filteredProblems.length === 0 ? (
            <EmptyState
              icon={<Code2 className="w-6 h-6 text-indigo-400" />}
              title="No DSA Problems Recorded Yet"
              description="Record problems as you practice. LIFE OS keeps an honest history of pure solves vs editorial walk-throughs."
              actionText="Log Your First Problem"
              onAction={() => setQuickAddOpen(true, 'dsa')}
            />
          ) : (
            <div className="space-y-2.5">
              {filteredProblems.map(prob => (
                <Card key={prob.id} noPadding className="p-4 hover:border-slate-700 transition-all">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] text-slate-400">{prob.date}</span>
                        <h4 className="font-semibold text-sm text-slate-100 truncate">{prob.name}</h4>
                        {prob.problemUrl && (
                          <a
                            href={prob.problemUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-indigo-400"
                            title="Open Problem"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <Badge
                          size="sm"
                          variant={
                            prob.difficulty === 'Hard'
                              ? 'danger'
                              : prob.difficulty === 'Medium'
                              ? 'warning'
                              : 'success'
                          }
                        >
                          {prob.difficulty}
                        </Badge>
                        <Badge size="sm" variant="default">
                          {prob.platform}
                        </Badge>
                        <Badge size="sm" variant="cyan">
                          {prob.topic}
                        </Badge>
                      </div>

                      {prob.keyLearnings && (
                        <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                          <span className="text-indigo-300 font-medium font-mono text-[11px]">Key pattern: </span>
                          {prob.keyLearnings}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <div className="text-right">
                        <Badge
                          size="sm"
                          variant={
                            prob.status === 'Solved Independently' ? 'purple' : 'default'
                          }
                        >
                          {prob.status}
                        </Badge>
                        <p className="text-[11px] font-mono text-slate-400 mt-1">
                          {prob.timeSpentMinutes} mins spent
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Delete "${prob.name}" log?`)) {
                            deleteDsaProblem(prob.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Study Sessions Sub-Tab */}
      {subTab === 'study' && (
        <div className="space-y-6">
          <Card title="Past 7 Days Study Hours" subtitle="Consistent study blocks for placement readiness">
            <StudyBarChart data={studyChartData} target={data.profile.dailyStudyTargetHours || 5} />
          </Card>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-200">Study Session History</h3>
              <button
                onClick={() => setQuickAddOpen(true, 'study')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                + Log New Session
              </button>
            </div>

            {data.studySessions.length === 0 ? (
              <EmptyState
                icon={<Clock className="w-6 h-6 text-indigo-400" />}
                title="No Study Sessions Logged"
                description="Keep track of focused study intervals across DSA, Core CS, System Design and Projects."
                actionText="Log Study Time"
                onAction={() => setQuickAddOpen(true, 'study')}
              />
            ) : (
              <div className="space-y-2">
                {data.studySessions.map(session => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#111522] border border-[#1f263d] text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400">{session.date}</span>
                      <Badge variant="info" size="sm">{session.category}</Badge>
                      {session.notes && (
                        <span className="text-slate-300 truncate max-w-md hidden sm:inline">
                          {session.notes}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-200">{session.durationMinutes}m</span>
                      <button
                        onClick={() => deleteStudySession(session.id)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Struggling Topics Sub-Tab */}
      {subTab === 'struggling' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Revision & Weak Spots</h3>
              <p className="text-xs text-slate-400">
                Identify recurring conceptual hurdles and systematically revisit them.
              </p>
            </div>
            <button
              onClick={() => setTopicModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Struggling Topic</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.strugglingTopics.map(topic => (
              <Card key={topic.id} noPadding className="p-4 border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          topic.status === 'Mastered'
                            ? 'success'
                            : topic.status === 'Revising'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {topic.status}
                      </Badge>
                      <Badge variant="default" size="sm">{topic.category}</Badge>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100 mt-1">{topic.name}</h4>
                    {topic.keyIssues && (
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">
                        {topic.keyIssues}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => {
                        const nextStatus =
                          topic.status === 'Needs Revision'
                            ? 'Revising'
                            : topic.status === 'Revising'
                            ? 'Mastered'
                            : 'Needs Revision';
                        editStrugglingTopic({ ...topic, status: nextStatus, lastRevisedDate: todayStr });
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-indigo-300 font-mono"
                    >
                      Cycle Status
                    </button>
                    <button
                      onClick={() => deleteStrugglingTopic(topic.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 4. Placement Pipeline Sub-Tab */}
      {subTab === 'placements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Company Placement Pipeline</h3>
              <p className="text-xs text-slate-400">
                Manage applications, OAs, interview rounds, and offers without chaos.
              </p>
            </div>
            <button
              onClick={() => setPlacementModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Application</span>
            </button>
          </div>

          {data.placements.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="w-6 h-6 text-indigo-400" />}
              title="No Placement Applications Tracked"
              description="Add campus or off-campus companies you have applied to or are scheduled for OA/interviews."
              actionText="Add First Application"
              onAction={() => setPlacementModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {data.placements.map(app => (
                <Card key={app.id} noPadding className="p-4 border-slate-800 hover:border-slate-700">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-100">{app.company}</h4>
                        <Badge
                          variant={
                            app.stage === 'Offer Received'
                              ? 'success'
                              : app.stage === 'Rejected'
                              ? 'danger'
                              : app.stage.includes('Interview')
                              ? 'purple'
                              : 'info'
                          }
                          size="sm"
                        >
                          {app.stage}
                        </Badge>
                        <Badge variant="default" size="sm">{app.priority} Priority</Badge>
                      </div>

                      <p className="text-xs text-slate-300 font-medium">{app.role}</p>

                      {app.deadline && (
                        <p className="text-[11px] font-mono text-amber-400">
                          OA / Deadline: {app.deadline}
                        </p>
                      )}

                      {app.compensation && (
                        <p className="text-[11px] font-mono text-emerald-400">
                          CTC: {app.compensation}
                        </p>
                      )}

                      {app.notes && (
                        <p className="text-xs text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800 mt-2">
                          {app.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <select
                        value={app.stage}
                        onChange={e => editPlacement({ ...app, stage: e.target.value as any })}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] text-slate-200"
                      >
                        <option value="Wishlist">Wishlist</option>
                        <option value="Applied">Applied</option>
                        <option value="OA Pending">OA Pending</option>
                        <option value="OA Cleared">OA Cleared</option>
                        <option value="Technical Interview">Technical Round</option>
                        <option value="Managerial / HR">HR Round</option>
                        <option value="Offer Received">Offer Received</option>
                        <option value="Rejected">Rejected</option>
                      </select>

                      <button
                        onClick={() => deletePlacement(app.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Projects Sub-Tab */}
      {subTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Engineering Portfolio Projects</h3>
              <p className="text-xs text-slate-400">
                Track architectural milestones and technical evidence for resume and interviews.
              </p>
            </div>
            <button
              onClick={() => setProjectModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          {data.projects.length === 0 ? (
            <EmptyState
              icon={<FolderGit2 className="w-6 h-6 text-indigo-400" />}
              title="No Projects Tracked"
              description="Keep your engineering resume standout by finishing milestones on real projects."
              actionText="Add Project"
              onAction={() => setProjectModalOpen(true)}
            />
          ) : (
            <div className="space-y-4">
              {data.projects.map(proj => (
                <Card key={proj.id} title={proj.title} subtitle={proj.description} action={
                  <div className="flex items-center gap-2">
                    <Badge variant={proj.status === 'Shipped' ? 'success' : 'info'} size="sm">
                      {proj.status}
                    </Badge>
                    <button
                      onClick={() => deleteProject(proj.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                }>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.techStack.map(t => (
                        <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>

                    <ProgressBar progress={proj.progressPercentage} showLabel label="Milestones Progress" />

                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <p className="text-xs font-medium text-slate-400">Milestone Deliverables:</p>
                      {proj.milestones.map(m => (
                        <div
                          key={m.id}
                          onClick={() => toggleProjectMilestone(proj.id, m.id)}
                          className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-900 cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={m.completed}
                            onChange={() => {}}
                            className="rounded bg-slate-800 border-slate-700 text-indigo-600 pointer-events-none"
                          />
                          <span className={m.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                            {m.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Struggling Topic Modal */}
      <Modal
        isOpen={topicModalOpen}
        onClose={() => setTopicModalOpen(false)}
        title="Add Weak / Struggling Topic"
        subtitle="Log algorithmic or CS topics that require deeper revision"
      >
        <form onSubmit={handleAddTopic} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Topic Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Graph Cycle Detection, B+ Trees in DBMS, Trie Implementation"
              value={newTopicName}
              onChange={e => setNewTopicName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={newTopicCategory}
                onChange={e => setNewTopicCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
              >
                <option value="DSA">DSA</option>
                <option value="Core CS">Core CS (OS / DBMS / CN)</option>
                <option value="System Design">System Design</option>
                <option value="Aptitude">Aptitude</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confidence (1-5)</label>
              <select
                value={newTopicConfidence}
                onChange={e => setNewTopicConfidence(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
              >
                <option value={1}>1 - Completely Stuck</option>
                <option value={2}>2 - Weak / Need Hints</option>
                <option value={3}>3 - Moderate understanding</option>
                <option value={4}>4 - Confident</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">What specifically is difficult?</label>
            <textarea
              rows={2}
              placeholder="e.g. Transition states in multi-dimensional dynamic programming..."
              value={newTopicIssues}
              onChange={e => setNewTopicIssues(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
          >
            Save Struggling Topic
          </button>
        </form>
      </Modal>

      {/* Placement Application Modal */}
      <Modal
        isOpen={placementModalOpen}
        onClose={() => setPlacementModalOpen(false)}
        title="Add Placement Application"
        subtitle="Track company, role, assessment deadlines, and interview stage"
      >
        <form onSubmit={handleAddPlacement} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Microsoft, Google, Uber"
                value={compName}
                onChange={e => setCompName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Role</label>
              <input
                type="text"
                placeholder="e.g. SDE-1 / SWE Intern"
                value={compRole}
                onChange={e => setCompRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Current Stage</label>
              <select
                value={compStage}
                onChange={e => setCompStage(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="OA Pending">OA Pending</option>
                <option value="OA Cleared">OA Cleared</option>
                <option value="Technical Interview">Technical Interview</option>
                <option value="Managerial / HR">Managerial / HR</option>
                <option value="Offer Received">Offer Received</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">OA Date / Deadline</label>
              <input
                type="date"
                value={compDeadline}
                onChange={e => setCompDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Referral details</label>
            <textarea
              rows={2}
              placeholder="e.g. Referred by senior. Study Graph DP and B-trees."
              value={compNotes}
              onChange={e => setCompNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
          >
            Save Placement Entry
          </button>
        </form>
      </Modal>

      {/* Project Modal */}
      <Modal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        title="Add Engineering Project"
        subtitle="Build evidence for technical interview rounds"
      >
        <form onSubmit={handleAddProject} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Project Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Distributed Task Queue in Go"
              value={projTitle}
              onChange={e => setProjTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Brief Description</label>
            <textarea
              rows={2}
              placeholder="What problem does it solve and what is its architecture?"
              value={projDesc}
              onChange={e => setProjDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Tech Stack (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Go, Redis, Docker, PostgreSQL"
              value={projTech}
              onChange={e => setProjTech(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Milestones (One per line)</label>
            <textarea
              rows={3}
              value={projMilestonesText}
              onChange={e => setProjMilestonesText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
          >
            Create Project Tracker
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CareerPage;
