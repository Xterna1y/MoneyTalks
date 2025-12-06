"use client"

import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Controller, SubmitHandler, useFieldArray, useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Sparkles,
} from "lucide-react"

import { Button } from "./../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./../../components/ui/card"
import { Progress } from "./../../components/ui/progress"
import { Switch } from "./../../components/ui/switch"
import { useOnboarding } from "./../../components/providers/onboarding-provider"

const onboardingSchema = z
  .object({
    profile: z.object({
      name: z.string().min(1, "Tell us your name"),
      salutation: z.string().optional(),
    }),
    income: z.object({
      frequency: z.enum(["Weekly", "Bi-Weekly", "Monthly", "Irregular/Gig Work"]),
      amount: z
        .coerce.number({ invalid_type_error: "Enter an amount" })
        .min(0, "Amount must be at least 0")
        .optional(),
      hasNoIncome: z.boolean().default(false),
    }),
    bills: z
      .array(
        z.object({
          name: z.string().min(1, "Bill name is required"),
          amount: z
            .coerce.number({ invalid_type_error: "Enter an amount" })
            .min(0, "Must be 0 or more"),
          dueDay: z
            .coerce.number({ invalid_type_error: "Enter a day" })
            .int()
            .min(1, "1-31")
            .max(31, "1-31"),
        })
      )
      .default([]),
    goals: z.object({
      savingsRate: z
        .coerce.number({ invalid_type_error: "Enter a percentage" })
        .min(0)
        .max(100),
      targetAmount: z
        .coerce.number({ invalid_type_error: "Enter a target" })
        .min(0)
        .optional(),
    }),
  })
  .superRefine((data, ctx) => {
    if (
      !data.income.hasNoIncome &&
      (data.income.amount === undefined || Number.isNaN(data.income.amount))
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Add your income amount",
        path: ["income", "amount"],
      })
    }
  })

type OnboardingForm = z.infer<typeof onboardingSchema>

const steps = [
  { id: "profile", title: "About You", subtitle: "How should we address you?" },
  { id: "income", title: "Income Source", subtitle: "How does money come in?" },
  {
    id: "bills",
    title: "Recurring Commitments",
    subtitle: "What bills do you pay each month?",
  },
  {
    id: "goals",
    title: "Budget Goals",
    subtitle: "How much do you want to save?",
  },
]

const billSuggestions = ["Electricity", "Water", "Rent", "Phone"]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const { setOnboardingData } = useOnboarding()

  const {
    control,
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema) as Resolver<OnboardingForm>,
    mode: "onBlur",
    defaultValues: {
      profile: {
        name: "",
        salutation: "",
      },
      income: {
        frequency: "Monthly",
        amount: 3500,
        hasNoIncome: false,
      },
      bills: [],
      goals: {
        savingsRate: 20,
        targetAmount: 0,
      },
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "bills",
    control,
  })

  const watchIncome = watch("income")
  const watchBills = watch("bills")
  const watchGoals = watch("goals")

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: "MYR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    []
  )

  const incomeAmount = watchIncome.hasNoIncome
    ? 0
    : Math.max(Number(watchIncome.amount) || 0, 0)

  const billsTotal = watchBills.reduce((sum, bill) => {
    const amt = Number(bill.amount) || 0
    return sum + amt
  }, 0)

  const savingsRateValue = Number(watchGoals.savingsRate) || 0
  const targetAmountValue =
    watchGoals.targetAmount !== undefined ? Number(watchGoals.targetAmount) : undefined

  const leftover = Math.max(incomeAmount - billsTotal, 0)
  const savingsFromRate = Math.round(leftover * (savingsRateValue / 100))
  const targetSavings =
    targetAmountValue !== undefined && !Number.isNaN(targetAmountValue)
      ? targetAmountValue
      : savingsFromRate

  const progressValue = ((step + 1) / steps.length) * 100

  const stepFieldMap: Record<number, (keyof OnboardingForm | string)[]> = {
    0: ["profile.name", "profile.salutation"],
    1: ["income.frequency", "income.amount", "income.hasNoIncome"],
    2: ["bills"],
    3: ["goals.savingsRate", "goals.targetAmount"],
  }

  const handleNext = async () => {
    const fieldsToValidate = stepFieldMap[step]
    const valid = await trigger(fieldsToValidate as any, {
      shouldFocus: true,
    })
    if (valid) setStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0))

  const onSubmit: SubmitHandler<OnboardingForm> = (values) => {
    // Persist to API later; mocked for now
    setOnboardingData(values)
    console.log("Onboarding complete", values)
    navigate("/dashboard")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-900 px-4 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center gap-3 text-lg text-emerald-100">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm uppercase tracking-wide text-emerald-200/80">
              Guided setup
            </p>
            <p className="text-xl font-semibold">
              We’ll tailor MoneyTalks to how you actually live.
            </p>
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900/70 text-slate-100 shadow-2xl backdrop-blur">
          <CardHeader className="gap-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold">
                  {steps[step].title}
                </CardTitle>
                <CardDescription className="text-lg text-slate-300">
                  {steps[step].subtitle}
                </CardDescription>
              </div>
              <div className="text-sm font-semibold text-emerald-200">
                Step {step + 1} of {steps.length}
              </div>
            </div>
            <Progress value={progressValue} className="h-3 bg-slate-800" />
          </CardHeader>

          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-200">
                        What should we call you?
                      </label>
                      <input
                        type="text"
                        className="h-12 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 text-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="e.g., Aiman"
                        {...register("profile.name")}
                      />
                      {errors.profile?.name && (
                        <p className="text-sm text-emerald-300">
                          {errors.profile.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-200">
                        How should we refer to you? (optional)
                      </label>
                      <input
                        type="text"
                        className="h-12 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 text-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="e.g., he/him, she/her, they/them, or a title"
                        {...register("profile.salutation")}
                      />
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-200">
                        Frequency
                      </label>
                      <select
                        className="h-12 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 text-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        {...register("income.frequency")}
                      >
                        <option>Weekly</option>
                        <option>Bi-Weekly</option>
                        <option>Monthly</option>
                        <option>Irregular/Gig Work</option>
                      </select>
                      {errors.income?.frequency && (
                        <p className="text-sm text-emerald-300">
                          {errors.income.frequency.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-200">
                        Amount (RM)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        disabled={watchIncome.hasNoIncome}
                        className="h-12 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 text-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-60"
                        {...register("income.amount")}
                      />
                      {errors.income?.amount && (
                        <p className="text-sm text-emerald-300">
                          {errors.income.amount.message}
                        </p>
                      )}
                    </div>

                    <Controller
                      control={control}
                      name="income.hasNoIncome"
                      render={({ field }) => (
                        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3">
                          <div className="space-y-1">
                            <p className="text-base font-semibold text-white">
                              I currently have no fixed income
                            </p>
                            <p className="text-sm text-slate-400">
                              We’ll base the plan on zero income until you update
                              this.
                            </p>
                          </div>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked)
                              if (checked) setValue("income.amount", 0)
                            }}
                            aria-label="Toggle no fixed income"
                          />
                        </div>
                      )}
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      {billSuggestions.map((bill) => (
                        <Button
                          key={bill}
                          type="button"
                          variant="secondary"
                          className="rounded-full bg-slate-800 text-slate-100 hover:bg-emerald-500/20"
                          onClick={() => {
                            const exists = fields.some(
                              (f) => f.name.toLowerCase() === bill.toLowerCase()
                            )
                            if (!exists) {
                              append({ name: bill, amount: 0, dueDay: 1 })
                            }
                          }}
                        >
                          {bill}
                        </Button>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {fields.length === 0 && (
                        <p className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-300">
                          Add your first bill to keep us on schedule.
                        </p>
                      )}

                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-12"
                        >
                          <div className="md:col-span-5 space-y-1">
                            <label className="text-sm font-semibold text-slate-200">
                              Bill name
                            </label>
                            <input
                              className="h-12 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 text-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                              placeholder="e.g., Electricity"
                              {...register(`bills.${index}.name` as const)}
                            />
                            {errors.bills?.[index]?.name && (
                              <p className="text-sm text-emerald-300">
                                {errors.bills[index]?.name?.message}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-4 space-y-1">
                            <label className="text-sm font-semibold text-slate-200">
                              Amount (RM)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min={0}
                              className="h-12 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 text-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                              {...register(`bills.${index}.amount` as const)}
                            />
                            {errors.bills?.[index]?.amount && (
                              <p className="text-sm text-emerald-300">
                                {errors.bills[index]?.amount?.message}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-3 space-y-1">
                            <label className="text-sm font-semibold text-slate-200">
                              Day of month
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={31}
                              className="h-12 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 text-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                              {...register(`bills.${index}.dueDay` as const)}
                            />
                            {errors.bills?.[index]?.dueDay && (
                              <p className="text-sm text-emerald-300">
                                {errors.bills[index]?.dueDay?.message}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-12 flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-sm text-slate-300 hover:bg-slate-800"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-400/50 bg-emerald-500/10 text-lg font-semibold text-emerald-100 hover:bg-emerald-500/20"
                      onClick={() => append({ name: "", amount: 0, dueDay: 1 })}
                    >
                      <Plus className="h-5 w-5" />
                      Add another bill
                    </Button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-200">
                        Savings goal (% of leftover)
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        className="w-full accent-emerald-400"
                        {...register("goals.savingsRate")}
                      />
                      <p className="text-lg font-semibold text-emerald-200">
                        {watchGoals.savingsRate || 0}% of leftovers
                      </p>
                      {errors.goals?.savingsRate && (
                        <p className="text-sm text-emerald-300">
                          {errors.goals.savingsRate.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-200">
                        Or set a target savings amount (RM)
                      </label>
                      <input
                        type="number"
                        min={0}
                        step="50"
                        className="h-12 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 text-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        {...register("goals.targetAmount")}
                        placeholder="e.g., 1000"
                      />
                      {errors.goals?.targetAmount && (
                        <p className="text-sm text-emerald-300">
                          {errors.goals.targetAmount.message}
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-lg text-emerald-50">
                      <p>
                        Based on your income of{" "}
                        <span className="font-semibold">
                          {currencyFormatter.format(incomeAmount)}
                        </span>{" "}
                        and bills of{" "}
                        <span className="font-semibold">
                          {currencyFormatter.format(billsTotal)}
                        </span>
                        , you will have{" "}
                        <span className="font-semibold">
                          {currencyFormatter.format(leftover)}
                        </span>{" "}
                        left. Setting aside{" "}
                        <span className="font-semibold">
                          {currencyFormatter.format(targetSavings)}
                        </span>{" "}
                        keeps you on track.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={step === 0}
                    className="h-12 px-4 text-base text-slate-200 hover:bg-slate-800 disabled:opacity-50"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </div>

                <div className="flex gap-2">
                  {step < steps.length - 1 && (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="h-12 px-6 text-base font-semibold"
                    >
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  {step === steps.length - 1 && (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex h-12 items-center gap-2 px-6 text-base font-semibold"
                    >
                      <Check className="h-5 w-5" />
                      {isSubmitting ? "Finishing..." : "Finish Setup"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

