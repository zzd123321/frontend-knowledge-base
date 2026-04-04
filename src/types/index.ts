export type SkillLevel = 'beginner' | 'intermediate' | 'advanced'

export interface Skill {
  id: string
  title: string
  description: string
  level: SkillLevel
  tags: string[]
  icon: string
}
